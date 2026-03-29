import { z } from "zod";

export type FoodCategory = "fruit" | "vegetable" | "whole_food" | "snack" | "sugary" | "drink";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  isHealthy: boolean;
  points: number;
  icon: string;
}

export interface MealRecord {
  id: string;
  studentId: string;
  foodId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "snack";
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  pointsRequired: number;
}

export interface StudentBadge {
  id: string;
  studentId: string;
  badgeId: string;
  earnedAt: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  monthlyBudget: number;
  monthlySpent: number;
}

export const insertMealRecordSchema = z.object({
  foodId: z.string(),
  mealType: z.enum(["breakfast", "lunch", "snack"]),
});

export type InsertMealRecord = z.infer<typeof insertMealRecordSchema>;

export const users = {
  id: "",
  username: "",
  password: "",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
