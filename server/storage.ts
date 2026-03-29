import type { 
  Student, 
  FoodItem, 
  MealRecord, 
  Badge, 
  StudentBadge,
  InsertMealRecord 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getStudent(): Promise<Student>;
  updateStudent(updates: Partial<Student>): Promise<Student>;
  getFoods(): Promise<FoodItem[]>;
  getFood(id: string): Promise<FoodItem | undefined>;
  getMeals(studentId: string): Promise<MealRecord[]>;
  getMealsWithFood(studentId: string): Promise<Array<MealRecord & { food: FoodItem }>>;
  getMonthlyMealsWithFood(studentId: string): Promise<Array<MealRecord & { food: FoodItem }>>;
  addMeal(studentId: string, meal: InsertMealRecord): Promise<MealRecord>;
  getBadges(): Promise<Badge[]>;
  getStudentBadges(studentId: string): Promise<StudentBadge[]>;
  awardBadge(studentId: string, badgeId: string): Promise<StudentBadge>;
  hasBadge(studentId: string, badgeId: string): Promise<boolean>;
  checkAndAwardBadges(studentId: string): Promise<StudentBadge[]>;
  resetMonthlySpending(): void;
}

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

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function isCurrentMonth(dateStr: string): boolean {
  const currentMonth = getCurrentMonth();
  return dateStr.startsWith(currentMonth.slice(0, 7));
}

export class MemStorage implements IStorage {
  private student: Student;
  private meals: Map<string, MealRecord>;
  private studentBadges: Map<string, StudentBadge>;
  private currentMonth: string;

  constructor() {
    this.currentMonth = getCurrentMonth();
    this.student = {
      id: "student-1",
      name: "Sharvani",
      avatar: "",
      totalPoints: 45,
      monthlyBudget: 50.00,
      monthlySpent: 0,
    };
    this.meals = new Map();
    this.studentBadges = new Map();

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    const sampleMeals: MealRecord[] = [
      { id: "m1", studentId: "student-1", foodId: "1", date: today, mealType: "breakfast" },
      { id: "m2", studentId: "student-1", foodId: "9", date: today, mealType: "lunch" },
      { id: "m3", studentId: "student-1", foodId: "16", date: today, mealType: "lunch" },
      { id: "m4", studentId: "student-1", foodId: "2", date: yesterday, mealType: "breakfast" },
      { id: "m5", studentId: "student-1", foodId: "5", date: yesterday, mealType: "lunch" },
      { id: "m6", studentId: "student-1", foodId: "12", date: today, mealType: "snack" },
      { id: "m7", studentId: "student-1", foodId: "12", date: yesterday, mealType: "snack" },
      { id: "m8", studentId: "student-1", foodId: "12", date: twoDaysAgo, mealType: "snack" },
    ];
    
    sampleMeals.forEach(m => this.meals.set(m.id, m));

    this.recalculateMonthlySpending();
  }

  private recalculateMonthlySpending(): void {
    const monthlyMeals = Array.from(this.meals.values()).filter(m => isCurrentMonth(m.date));
    this.student.monthlySpent = monthlyMeals.reduce((sum, meal) => {
      const food = foodItems.find(f => f.id === meal.foodId);
      return sum + (food?.price || 0);
    }, 0);
  }

  resetMonthlySpending(): void {
    const newMonth = getCurrentMonth();
    if (newMonth !== this.currentMonth) {
      this.currentMonth = newMonth;
      this.student.monthlySpent = 0;
    }
  }

  async getStudent(): Promise<Student> {
    this.resetMonthlySpending();
    return this.student;
  }

  async updateStudent(updates: Partial<Student>): Promise<Student> {
    this.student = { ...this.student, ...updates };
    return this.student;
  }

  async getFoods(): Promise<FoodItem[]> {
    return foodItems;
  }

  async getFood(id: string): Promise<FoodItem | undefined> {
    return foodItems.find(f => f.id === id);
  }

  async getMeals(studentId: string): Promise<MealRecord[]> {
    return Array.from(this.meals.values())
      .filter(m => m.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getMealsWithFood(studentId: string): Promise<Array<MealRecord & { food: FoodItem }>> {
    const meals = await this.getMeals(studentId);
    return meals
      .map(meal => {
        const food = foodItems.find(f => f.id === meal.foodId);
        if (!food) return null;
        return { ...meal, food };
      })
      .filter((m): m is MealRecord & { food: FoodItem } => m !== null);
  }

  async getMonthlyMealsWithFood(studentId: string): Promise<Array<MealRecord & { food: FoodItem }>> {
    const allMeals = await this.getMealsWithFood(studentId);
    return allMeals.filter(m => isCurrentMonth(m.date));
  }

  async addMeal(studentId: string, meal: InsertMealRecord): Promise<MealRecord> {
    const id = randomUUID();
    const today = new Date().toISOString().split('T')[0];
    
    const newMeal: MealRecord = {
      id,
      studentId,
      foodId: meal.foodId,
      date: today,
      mealType: meal.mealType,
    };
    
    this.meals.set(id, newMeal);

    const food = await this.getFood(meal.foodId);
    if (food) {
      this.student.totalPoints += food.points;
      if (isCurrentMonth(today)) {
        this.student.monthlySpent += food.price;
      }
    }
    
    return newMeal;
  }

  async getBadges(): Promise<Badge[]> {
    return badges;
  }

  async getStudentBadges(studentId: string): Promise<StudentBadge[]> {
    return Array.from(this.studentBadges.values())
      .filter(sb => sb.studentId === studentId);
  }

  async hasBadge(studentId: string, badgeId: string): Promise<boolean> {
    const studentBadges = await this.getStudentBadges(studentId);
    return studentBadges.some(sb => sb.badgeId === badgeId);
  }

  async awardBadge(studentId: string, badgeId: string): Promise<StudentBadge> {
    const id = randomUUID();
    const newBadge: StudentBadge = {
      id,
      studentId,
      badgeId,
      earnedAt: new Date().toISOString(),
    };
    this.studentBadges.set(id, newBadge);
    return newBadge;
  }

  async checkAndAwardBadges(studentId: string): Promise<StudentBadge[]> {
    const newlyAwarded: StudentBadge[] = [];
    const meals = await this.getMealsWithFood(studentId);
    const student = await this.getStudent();
    
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const weekMeals = meals.filter(m => new Date(m.date) >= weekAgo);
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = meals.filter(m => m.date === today);

    for (const badge of badges) {
      const hasBadge = await this.hasBadge(studentId, badge.id);
      if (hasBadge) continue;

      let earned = false;

      switch (badge.requirement) {
        case "vegetables":
          const vegCount = weekMeals.filter(m => m.food.category === "vegetable").length;
          earned = vegCount >= 5;
          break;
        case "fruits":
          const uniqueFruits = new Set(weekMeals.filter(m => m.food.category === "fruit").map(m => m.food.id));
          earned = uniqueFruits.size >= 4;
          break;
        case "balance":
          const todayCategories = new Set(todayMeals.map(m => m.food.category));
          earned = todayCategories.size >= 3;
          break;
        case "water":
          const daysWithWater = new Set(
            weekMeals.filter(m => m.food.id === "16").map(m => m.date)
          );
          earned = daysWithWater.size >= 7;
          break;
        case "budget":
          earned = student.monthlySpent <= student.monthlyBudget && meals.length >= 20;
          break;
        case "points":
          earned = student.totalPoints >= badge.pointsRequired;
          break;
      }

      if (earned) {
        const awarded = await this.awardBadge(studentId, badge.id);
        newlyAwarded.push(awarded);
      }
    }

    return newlyAwarded;
  }
}

export const storage = new MemStorage();
