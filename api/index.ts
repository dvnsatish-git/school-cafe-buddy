import express from "express";
import { randomUUID } from "crypto";
import { z } from "zod";

// ---- Types ----
type FoodCategory = "fruit" | "vegetable" | "whole_food" | "snack" | "sugary" | "drink";

interface FoodItem {
  id: string; name: string; category: FoodCategory; price: number;
  isHealthy: boolean; points: number; icon: string;
}
interface MealRecord {
  id: string; studentId: string; foodId: string; date: string;
  mealType: "breakfast" | "lunch" | "snack";
}
interface Badge {
  id: string; name: string; description: string; icon: string;
  requirement: string; pointsRequired: number;
}
interface StudentBadge {
  id: string; studentId: string; badgeId: string; earnedAt: string;
}
interface Student {
  id: string; name: string; avatar: string; totalPoints: number;
  monthlyBudget: number; monthlySpent: number;
}

const insertMealRecordSchema = z.object({
  foodId: z.string(),
  mealType: z.enum(["breakfast", "lunch", "snack"]),
});

// ---- Data ----
const foodItems: FoodItem[] = [
  { id: "1", name: "Apple", category: "fruit", price: 0.75, isHealthy: true, points: 10, icon: "Apple" },
  { id: "2", name: "Banana", category: "fruit", price: 0.50, isHealthy: true, points: 10, icon: "Banana" },
  { id: "3", name: "Orange", category: "fruit", price: 0.75, isHealthy: true, points: 10, icon: "Citrus" },
  { id: "4", name: "Grapes", category: "fruit", price: 1.00, isHealthy: true, points: 10, icon: "Grape" },
  { id: "5", name: "Carrots", category: "vegetable", price: 0.50, isHealthy: true, points: 15, icon: "Carrot" },
  { id: "6", name: "Broccoli", category: "vegetable", price: 1.00, isHealthy: true, points: 15, icon: "Leaf" },
  { id: "7", name: "Salad", category: "vegetable", price: 2.00, isHealthy: true, points: 20, icon: "Salad" },
  { id: "8", name: "Corn", category: "vegetable", price: 0.75, isHealthy: true, points: 12, icon: "Wheat" },
  { id: "9", name: "Sandwich", category: "whole_food", price: 3.50, isHealthy: true, points: 8, icon: "Sandwich" },
  { id: "10", name: "Pasta", category: "whole_food", price: 3.00, isHealthy: true, points: 5, icon: "Utensils" },
  { id: "11", name: "Rice Bowl", category: "whole_food", price: 3.25, isHealthy: true, points: 6, icon: "Soup" },
  { id: "12", name: "Chips", category: "snack", price: 1.50, isHealthy: false, points: 0, icon: "Cookie" },
  { id: "13", name: "Cookies", category: "snack", price: 1.25, isHealthy: false, points: 0, icon: "Cookie" },
  { id: "14", name: "Candy Bar", category: "sugary", price: 1.00, isHealthy: false, points: 0, icon: "Candy" },
  { id: "15", name: "Soda", category: "sugary", price: 1.50, isHealthy: false, points: 0, icon: "Cup" },
  { id: "16", name: "Water", category: "drink", price: 0.50, isHealthy: true, points: 5, icon: "Droplet" },
  { id: "17", name: "Milk", category: "drink", price: 1.00, isHealthy: true, points: 8, icon: "Milk" },
  { id: "18", name: "Juice", category: "drink", price: 1.25, isHealthy: true, points: 5, icon: "Wine" },
];

const badges: Badge[] = [
  { id: "1", name: "Veggie Hero", description: "Eat 5 vegetables in a week", icon: "Carrot", requirement: "vegetables", pointsRequired: 75 },
  { id: "2", name: "Fruit Explorer", description: "Try 4 different fruits", icon: "Apple", requirement: "fruits", pointsRequired: 40 },
  { id: "3", name: "Balanced Plate Star", description: "Eat from 3 food groups in one day", icon: "Star", requirement: "balance", pointsRequired: 50 },
  { id: "4", name: "Hydration Champion", description: "Drink water every day for a week", icon: "Droplet", requirement: "water", pointsRequired: 35 },
  { id: "5", name: "Smart Saver", description: "Stay under budget for a month", icon: "PiggyBank", requirement: "budget", pointsRequired: 100 },
  { id: "6", name: "Super Star", description: "Earn 200 total points", icon: "Trophy", requirement: "points", pointsRequired: 200 },
];

// ---- Storage ----
function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
function isCurrentMonth(dateStr: string) {
  return dateStr.startsWith(getCurrentMonth().slice(0, 7));
}

const student: Student = {
  id: "student-1", name: "Sharvani", avatar: "",
  totalPoints: 45, monthlyBudget: 50.00, monthlySpent: 0,
};

const mealsMap = new Map<string, MealRecord>();
const studentBadgesMap = new Map<string, StudentBadge>();

// Seed sample meals
const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];

[
  { id: "m1", studentId: "student-1", foodId: "1", date: today, mealType: "breakfast" },
  { id: "m2", studentId: "student-1", foodId: "9", date: today, mealType: "lunch" },
  { id: "m3", studentId: "student-1", foodId: "16", date: today, mealType: "lunch" },
  { id: "m4", studentId: "student-1", foodId: "2", date: yesterday, mealType: "breakfast" },
  { id: "m5", studentId: "student-1", foodId: "5", date: yesterday, mealType: "lunch" },
  { id: "m6", studentId: "student-1", foodId: "12", date: today, mealType: "snack" },
  { id: "m7", studentId: "student-1", foodId: "12", date: yesterday, mealType: "snack" },
  { id: "m8", studentId: "student-1", foodId: "12", date: twoDaysAgo, mealType: "snack" },
].forEach((m) => mealsMap.set(m.id, m as MealRecord));

student.monthlySpent = Array.from(mealsMap.values())
  .filter((m) => isCurrentMonth(m.date))
  .reduce((sum, m) => sum + (foodItems.find((f) => f.id === m.foodId)?.price ?? 0), 0);

// ---- Storage helpers ----
function getMealsWithFood(studentId: string) {
  return Array.from(mealsMap.values())
    .filter((m) => m.studentId === studentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((m) => {
      const food = foodItems.find((f) => f.id === m.foodId);
      return food ? { ...m, food } : null;
    })
    .filter((m): m is MealRecord & { food: FoodItem } => m !== null);
}

async function checkAndAwardBadges(studentId: string) {
  const newlyAwarded: StudentBadge[] = [];
  const meals = getMealsWithFood(studentId);
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const weekMeals = meals.filter((m) => new Date(m.date) >= weekAgo);
  const todayMeals = meals.filter((m) => m.date === new Date().toISOString().split("T")[0]);
  const existingBadgeIds = new Set(
    Array.from(studentBadgesMap.values()).filter((sb) => sb.studentId === studentId).map((sb) => sb.badgeId)
  );

  for (const badge of badges) {
    if (existingBadgeIds.has(badge.id)) continue;
    let earned = false;
    switch (badge.requirement) {
      case "vegetables":
        earned = weekMeals.filter((m) => m.food.category === "vegetable").length >= 5;
        break;
      case "fruits":
        earned = new Set(weekMeals.filter((m) => m.food.category === "fruit").map((m) => m.food.id)).size >= 4;
        break;
      case "balance":
        earned = new Set(todayMeals.map((m) => m.food.category)).size >= 3;
        break;
      case "water":
        earned = new Set(weekMeals.filter((m) => m.food.id === "16").map((m) => m.date)).size >= 7;
        break;
      case "budget":
        earned = student.monthlySpent <= student.monthlyBudget && meals.length >= 20;
        break;
      case "points":
        earned = student.totalPoints >= badge.pointsRequired;
        break;
    }
    if (earned) {
      const id = randomUUID();
      const awarded: StudentBadge = { id, studentId, badgeId: badge.id, earnedAt: new Date().toISOString() };
      studentBadgesMap.set(id, awarded);
      newlyAwarded.push(awarded);
    }
  }
  return newlyAwarded;
}

// ---- Express app ----
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/dashboard", async (req, res) => {
  try {
    const earnedBadges = Array.from(studentBadgesMap.values()).filter((sb) => sb.studentId === student.id);
    const recentMeals = getMealsWithFood(student.id);
    const todayStr = new Date().toISOString().split("T")[0];
    const todayMeals = recentMeals.filter((m) => m.date === todayStr);
    const todayPoints = todayMeals.reduce((sum, m) => sum + m.food.points, 0);
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const weekMeals = recentMeals.filter((m) => new Date(m.date) >= weekAgo);
    const weeklyStats = {
      fruits: weekMeals.filter((m) => m.food.category === "fruit").length,
      vegetables: weekMeals.filter((m) => m.food.category === "vegetable").length,
      snacks: weekMeals.filter((m) => m.food.category === "snack" || m.food.category === "sugary").length,
      water: weekMeals.filter((m) => m.food.id === "16").length,
    };
    const alerts: Array<{ type: "tip" | "encouragement" | "recommendation"; message: string }> = [];
    if (todayPoints > 0) alerts.push({ type: "encouragement", message: "Great job choosing healthy food today! Keep it up!" });
    if (weeklyStats.snacks >= 5) alerts.push({ type: "tip", message: "You've had a lot of snacks this week. Want to try a fruit tomorrow?" });
    if (weeklyStats.vegetables === 0) alerts.push({ type: "recommendation", message: "You haven't tried vegetables this week - give carrots a try!" });
    res.json({ student, badges, earnedBadges, recentMeals: recentMeals.slice(0, 10), weeklyStats, todayPoints, alerts });
  } catch {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

app.get("/api/foods", async (req, res) => {
  try {
    const meals = getMealsWithFood(student.id);
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const recentSnackCount = meals
      .filter((m) => new Date(m.date) >= weekAgo)
      .filter((m) => m.food.category === "snack" || m.food.category === "sugary").length;
    res.json({ foods: foodItems, recentSnackCount });
  } catch {
    res.status(500).json({ error: "Failed to load foods" });
  }
});

app.post("/api/meals", async (req, res) => {
  try {
    const result = insertMealRecordSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: "Invalid meal data" });
    const id = randomUUID();
    const todayStr = new Date().toISOString().split("T")[0];
    const newMeal: MealRecord = { id, studentId: student.id, foodId: result.data.foodId, date: todayStr, mealType: result.data.mealType };
    mealsMap.set(id, newMeal);
    const food = foodItems.find((f) => f.id === result.data.foodId);
    if (food) {
      student.totalPoints += food.points;
      if (isCurrentMonth(todayStr)) student.monthlySpent += food.price;
    }
    const newBadges = await checkAndAwardBadges(student.id);
    res.json({ meal: newMeal, newBadges, student });
  } catch {
    res.status(500).json({ error: "Failed to add meal" });
  }
});

app.get("/api/meals", async (req, res) => {
  try {
    res.json(getMealsWithFood(student.id));
  } catch {
    res.status(500).json({ error: "Failed to load meals" });
  }
});

app.get("/api/badges", async (req, res) => {
  try {
    const earnedBadges = Array.from(studentBadgesMap.values()).filter((sb) => sb.studentId === student.id);
    res.json({ student, badges, earnedBadges });
  } catch {
    res.status(500).json({ error: "Failed to load badges" });
  }
});

app.get("/api/spending", async (req, res) => {
  try {
    const allMeals = getMealsWithFood(student.id);
    const monthlyMeals = allMeals.filter((m) => isCurrentMonth(m.date));
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const weeklySpending = monthlyMeals.filter((m) => new Date(m.date) >= weekAgo).reduce((sum, m) => sum + m.food.price, 0);
    const daysWithMeals = new Set(monthlyMeals.map((m) => m.date)).size || 1;
    const dailyAverage = student.monthlySpent / daysWithMeals;
    res.json({ student, monthlyMeals, weeklySpending, dailyAverage });
  } catch {
    res.status(500).json({ error: "Failed to load spending data" });
  }
});

export default app;
