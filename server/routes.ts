import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMealRecordSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/dashboard", async (req, res) => {
    try {
      const student = await storage.getStudent();
      const badges = await storage.getBadges();
      const earnedBadges = await storage.getStudentBadges(student.id);
      const recentMeals = await storage.getMealsWithFood(student.id);
      
      const today = new Date().toISOString().split('T')[0];
      const todayMeals = recentMeals.filter(m => m.date === today);
      const todayPoints = todayMeals.reduce((sum, m) => sum + m.food.points, 0);

      const weekAgo = new Date(Date.now() - 7 * 86400000);
      const weekMeals = recentMeals.filter(m => new Date(m.date) >= weekAgo);
      
      const weeklyStats = {
        fruits: weekMeals.filter(m => m.food.category === "fruit").length,
        vegetables: weekMeals.filter(m => m.food.category === "vegetable").length,
        snacks: weekMeals.filter(m => m.food.category === "snack" || m.food.category === "sugary").length,
        water: weekMeals.filter(m => m.food.id === "16").length,
      };

      const alerts: Array<{ type: "tip" | "encouragement" | "recommendation"; message: string }> = [];
      
      if (todayPoints > 0) {
        alerts.push({
          type: "encouragement",
          message: "Great job choosing healthy food today! Keep it up!",
        });
      }
      
      if (weeklyStats.snacks >= 5) {
        alerts.push({
          type: "tip",
          message: "You've had a lot of snacks this week. Want to try a fruit tomorrow?",
        });
      }
      
      if (weeklyStats.vegetables === 0) {
        alerts.push({
          type: "recommendation",
          message: "You haven't tried vegetables this week - give carrots a try!",
        });
      }

      res.json({
        student,
        badges,
        earnedBadges,
        recentMeals: recentMeals.slice(0, 10),
        weeklyStats,
        todayPoints,
        alerts,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to load dashboard" });
    }
  });

  app.get("/api/foods", async (req, res) => {
    try {
      const foods = await storage.getFoods();
      const student = await storage.getStudent();
      const meals = await storage.getMealsWithFood(student.id);
      
      const weekAgo = new Date(Date.now() - 7 * 86400000);
      const recentSnackCount = meals
        .filter(m => new Date(m.date) >= weekAgo)
        .filter(m => m.food.category === "snack" || m.food.category === "sugary")
        .length;

      res.json({ foods, recentSnackCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to load foods" });
    }
  });

  app.post("/api/meals", async (req, res) => {
    try {
      const result = insertMealRecordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid meal data" });
      }

      const student = await storage.getStudent();
      const meal = await storage.addMeal(student.id, result.data);
      
      const newBadges = await storage.checkAndAwardBadges(student.id);
      const updatedStudent = await storage.getStudent();
      
      res.json({ 
        meal, 
        newBadges,
        student: updatedStudent,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to add meal" });
    }
  });

  app.get("/api/meals", async (req, res) => {
    try {
      const student = await storage.getStudent();
      const meals = await storage.getMealsWithFood(student.id);
      res.json(meals);
    } catch (error) {
      res.status(500).json({ error: "Failed to load meals" });
    }
  });

  app.get("/api/badges", async (req, res) => {
    try {
      const student = await storage.getStudent();
      const badges = await storage.getBadges();
      const earnedBadges = await storage.getStudentBadges(student.id);
      
      res.json({ student, badges, earnedBadges });
    } catch (error) {
      res.status(500).json({ error: "Failed to load badges" });
    }
  });

  app.get("/api/spending", async (req, res) => {
    try {
      const student = await storage.getStudent();
      const monthlyMeals = await storage.getMonthlyMealsWithFood(student.id);
      
      const weekAgo = new Date(Date.now() - 7 * 86400000);
      const weekMeals = monthlyMeals.filter(m => new Date(m.date) >= weekAgo);
      const weeklySpending = weekMeals.reduce((sum, m) => sum + m.food.price, 0);
      
      const daysWithMeals = new Set(monthlyMeals.map(m => m.date)).size || 1;
      const dailyAverage = student.monthlySpent / daysWithMeals;

      res.json({
        student,
        monthlyMeals,
        weeklySpending,
        dailyAverage,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to load spending data" });
    }
  });

  return httpServer;
}
