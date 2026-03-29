import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Wallet, TrendingDown, Calendar, DollarSign, PiggyBank, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import type { Student, MealRecord, FoodItem } from "@shared/schema";

interface SpendingData {
  student: Student;
  monthlyMeals: Array<MealRecord & { food: FoodItem }>;
  weeklySpending: number;
  dailyAverage: number;
}

export default function Spending() {
  const { data, isLoading } = useQuery<SpendingData>({
    queryKey: ["/api/spending"],
  });

  if (isLoading) {
    return <SpendingSkeleton />;
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Something went wrong. Please try again!</p>
      </div>
    );
  }

  const percentage = Math.min(100, Math.round((data.student.monthlySpent / data.student.monthlyBudget) * 100));
  const remaining = Math.max(0, data.student.monthlyBudget - data.student.monthlySpent);
  const isNearLimit = percentage >= 80;
  const isOverLimit = data.student.monthlySpent >= data.student.monthlyBudget;

  const categorySpending = data.monthlyMeals.reduce((acc, meal) => {
    const cat = meal.food.category;
    acc[cat] = (acc[cat] || 0) + meal.food.price;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels: Record<string, string> = {
    fruit: "Fruits",
    vegetable: "Vegetables",
    whole_food: "Main Foods",
    snack: "Snacks",
    sugary: "Sweet Treats",
    drink: "Drinks",
  };

  const categoryColors: Record<string, string> = {
    fruit: "bg-pink-500",
    vegetable: "bg-green-500",
    whole_food: "bg-amber-500",
    snack: "bg-orange-500",
    sugary: "bg-red-500",
    drink: "bg-blue-500",
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">My Spending</h1>
          <p className="text-muted-foreground">Track your food budget</p>
        </div>
      </div>

      <Card className={`p-6 mb-6 ${
        isOverLimit 
          ? "bg-destructive/5 border-destructive/20" 
          : isNearLimit 
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            : ""
      }`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isOverLimit 
                ? "bg-destructive/10 text-destructive" 
                : isNearLimit 
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" 
                  : "bg-primary/10 text-primary"
            }`}>
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Budget</p>
              <p className="text-3xl font-bold" data-testid="text-budget">${data.student.monthlyBudget.toFixed(2)}</p>
            </div>
          </div>
          
          {isOverLimit ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-full">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Over budget</span>
            </div>
          ) : isNearLimit ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Almost there</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">On track</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-muted-foreground">Spent this month</p>
              <p className="text-2xl font-bold" data-testid="text-spent">${data.student.monthlySpent.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={`text-2xl font-bold ${remaining <= 5 ? "text-destructive" : "text-primary"}`} data-testid="text-remaining">
                ${remaining.toFixed(2)}
              </p>
            </div>
          </div>

          <Progress 
            value={percentage} 
            className={`h-4 ${isOverLimit ? "[&>div]:bg-destructive" : isNearLimit ? "[&>div]:bg-amber-500" : ""}`}
          />
          
          <p className="text-center text-sm text-muted-foreground">{percentage}% of budget used</p>
        </div>

        {isNearLimit && !isOverLimit && (
          <div className="mt-6 p-4 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
              You're close to your monthly budget! Can you wait a few days before buying extra snacks?
            </p>
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-xl font-bold" data-testid="text-weekly">${data.weeklySpending.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="text-xl font-bold" data-testid="text-daily">${data.dailyAverage.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Purchases</p>
              <p className="text-xl font-bold" data-testid="text-purchases">{data.monthlyMeals.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Spending by Category
        </h3>
        
        {Object.keys(categorySpending).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(categorySpending)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => {
                const catPercentage = Math.round((amount / data.student.monthlySpent) * 100) || 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{categoryLabels[category] || category}</span>
                      <span className="text-muted-foreground">${amount.toFixed(2)} ({catPercentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${categoryColors[category] || "bg-gray-500"}`}
                        style={{ width: `${catPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No spending data yet this month.
          </p>
        )}
      </Card>

      <Card className="p-5 mt-6 bg-gradient-to-br from-primary/5 to-transparent">
        <h3 className="font-semibold mb-3">Money-Saving Tips!</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">1.</span>
            Bring a water bottle from home instead of buying drinks
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">2.</span>
            Choose fruits over packaged snacks - they're healthier and cheaper!
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">3.</span>
            Plan your meals for the week to avoid extra purchases
          </li>
        </ul>
      </Card>
    </div>
  );
}

function SpendingSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      <Skeleton className="h-64 mb-6" />
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      
      <Skeleton className="h-48" />
    </div>
  );
}
