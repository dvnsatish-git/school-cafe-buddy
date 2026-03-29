import type { FoodItem, Badge } from "@shared/schema";

export const foodItems: FoodItem[] = [
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

export const badges: Badge[] = [
  { id: "1", name: "Veggie Hero", description: "Eat 5 vegetables in a week", icon: "Carrot", requirement: "vegetables", pointsRequired: 75 },
  { id: "2", name: "Fruit Explorer", description: "Try 4 different fruits", icon: "Apple", requirement: "fruits", pointsRequired: 40 },
  { id: "3", name: "Balanced Plate Star", description: "Eat from 3 food groups in one day", icon: "Star", requirement: "balance", pointsRequired: 50 },
  { id: "4", name: "Hydration Champion", description: "Drink water every day for a week", icon: "Droplet", requirement: "water", pointsRequired: 35 },
  { id: "5", name: "Smart Saver", description: "Stay under budget for a month", icon: "PiggyBank", requirement: "budget", pointsRequired: 100 },
  { id: "6", name: "Super Star", description: "Earn 200 total points", icon: "Trophy", requirement: "points", pointsRequired: 200 },
];

export const friendlyMessages = {
  tooManySnacks: [
    "You've had a lot of snacks this week. Want to try a fruit tomorrow?",
    "Balance is key! How about a veggie next time?",
    "Snacks are yummy, but fruits give you superpowers!",
  ],
  budgetWarning: [
    "You're close to your monthly food budget!",
    "Can you wait a few days before buying extra snacks?",
    "Great job being aware of spending!",
  ],
  encouragement: [
    "Great job choosing healthy food today!",
    "You're doing amazing! Keep it up!",
    "Wow, look at all those points you earned!",
  ],
  recommendations: [
    "Instead of chips, how about yogurt?",
    "You haven't tried vegetables this week - give carrots a try!",
    "Water is a great choice for staying energized!",
  ],
};

export const getRecommendationForFood = (foodName: string): { message: string; alternatives: string[] } => {
  const name = foodName.toLowerCase();
  
  if (name === "chips") {
    return {
      message: "Instead of chips, try a crunchy healthy snack!",
      alternatives: ["Carrots", "Apple", "Grapes"]
    };
  }
  if (name === "soda") {
    return {
      message: "Instead of soda, try a refreshing healthy drink!",
      alternatives: ["Water", "Milk", "Juice"]
    };
  }
  if (name === "cookies") {
    return {
      message: "Instead of cookies, try a naturally sweet treat!",
      alternatives: ["Apple", "Banana", "Grapes"]
    };
  }
  if (name === "candy bar") {
    return {
      message: "Instead of candy, try something naturally sweet!",
      alternatives: ["Orange", "Grapes", "Banana"]
    };
  }
  
  return {
    message: "How about trying a healthy alternative?",
    alternatives: ["Apple", "Carrots", "Water"]
  };
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "fruit":
      return "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300";
    case "vegetable":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
    case "whole_food":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
    case "snack":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
    case "sugary":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
    case "drink":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  }
};

export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "fruit": return "Fruits";
    case "vegetable": return "Vegetables";
    case "whole_food": return "Main Foods";
    case "snack": return "Snacks";
    case "sugary": return "Sweet Treats";
    case "drink": return "Drinks";
    default: return category;
  }
};
