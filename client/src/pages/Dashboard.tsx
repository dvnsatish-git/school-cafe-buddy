import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PointsDisplay } from "@/components/PointsDisplay";
import { SpendingCard } from "@/components/SpendingCard";
import { BadgeCard } from "@/components/BadgeCard";
import { FriendlyAlert } from "@/components/FriendlyAlert";
import { WeeklyStats } from "@/components/WeeklyStats";
import { FoodHistory } from "@/components/FoodHistory";
import { StudentAvatar } from "@/components/StudentAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuddy } from "@/context/BuddyContext";
import { UtensilsCrossed, Award, History, ChevronRight, Sparkles, Apple, Carrot, Droplet, Star, Mic } from "lucide-react";
import { Link } from "wouter";
import type { Student, Badge as BadgeType, MealRecord, FoodItem, StudentBadge } from "@shared/schema";

interface DashboardData {
  student: Student;
  badges: BadgeType[];
  earnedBadges: StudentBadge[];
  recentMeals: Array<MealRecord & { food: FoodItem }>;
  weeklyStats: {
    fruits: number;
    vegetables: number;
    snacks: number;
    water: number;
  };
  todayPoints: number;
  alerts: Array<{ type: "tip" | "encouragement" | "recommendation"; message: string }>;
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });
  const { selectedBuddy, getBuddyMessage, speakMessage, setBuddyState } = useBuddy();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Something went wrong. Please try again!</p>
      </div>
    );
  }

  const earnedBadgeIds = new Set(data.earnedBadges.map(eb => eb.badgeId));

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Hero greeting */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <StudentAvatar name={data.student.name} size="lg" />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold" data-testid="text-welcome">
              Hi, {data.student.name}! 👋
            </h1>
            <p className="text-muted-foreground font-sans">Ready to make great food choices today?</p>
          </div>
        </div>
        <Link href="/select-food">
          <Button size="lg" className="rounded-full font-display font-bold" data-testid="button-select-food">
            <UtensilsCrossed className="w-5 h-5 mr-2" />
            Choose Food
          </Button>
        </Link>
      </div>

      {/* Buddy Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 24 }}
        className="relative overflow-hidden rounded-3xl p-5 flex items-center gap-4"
        style={{
          background: `linear-gradient(135deg, ${selectedBuddy.color}22, ${selectedBuddy.color}44)`,
          border: `2px solid ${selectedBuddy.color}55`,
        }}
      >
        <span className="text-5xl animate-buddy-bob inline-block shrink-0">{selectedBuddy.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-gray-800 text-lg leading-snug">
            {getBuddyMessage("morning")}
          </p>
          <p className="font-sans text-sm text-gray-500 mt-1">{selectedBuddy.name} is here to help!</p>
        </div>
        <button
          onClick={() => {
            speakMessage(getBuddyMessage("morning"));
            setBuddyState("happy");
            setTimeout(() => setBuddyState("idle"), 1500);
          }}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-display font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: selectedBuddy.color }}
        >
          <Mic className="w-3 h-3" />
          Talk to {selectedBuddy.name}
        </button>
      </motion.div>

      {data.alerts.length > 0 && (
        <div className="space-y-3">
          {data.alerts.slice(0, 2).map((alert, index) => (
            <FriendlyAlert key={index} type={alert.type} message={alert.message} />
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="font-semibold text-lg">Try Today!</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Here are some healthy foods to try for extra points
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/select-food">
            <Card className="p-3 hover-elevate cursor-pointer text-center" data-testid="card-try-fruit">
              <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-2">
                <Apple className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <p className="font-medium text-sm">Try a Fruit</p>
              <Badge variant="secondary" className="mt-1 text-xs">+10 pts</Badge>
            </Card>
          </Link>
          <Link href="/select-food">
            <Card className="p-3 hover-elevate cursor-pointer text-center" data-testid="card-try-veggie">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                <Carrot className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="font-medium text-sm">Eat Veggies</p>
              <Badge variant="secondary" className="mt-1 text-xs">+15 pts</Badge>
            </Card>
          </Link>
          <Link href="/select-food">
            <Card className="p-3 hover-elevate cursor-pointer text-center" data-testid="card-try-water">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-medium text-sm">Drink Water</p>
              <Badge variant="secondary" className="mt-1 text-xs">+5 pts</Badge>
            </Card>
          </Link>
          <Link href="/select-food">
            <Card className="p-3 hover-elevate cursor-pointer text-center" data-testid="card-try-balanced">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="font-medium text-sm">Balanced Meal</p>
              <Badge variant="secondary" className="mt-1 text-xs">Bonus!</Badge>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <PointsDisplay points={data.student.totalPoints} todayPoints={data.todayPoints} />
        <SpendingCard spent={data.student.monthlySpent} budget={data.student.monthlyBudget} />
      </div>

      <WeeklyStats {...data.weeklyStats} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-lg">My Badges</h2>
          </div>
          <Link href="/badges">
            <Button variant="ghost" size="sm" data-testid="button-view-all-badges">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.badges.slice(0, 6).map((badge) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              isEarned={earnedBadgeIds.has(badge.id)}
              progress={data.student.totalPoints}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Recent Foods</h2>
          </div>
        </div>
        
        <FoodHistory meals={data.recentMeals.slice(0, 5)} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      
      <Skeleton className="h-40" />
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}
