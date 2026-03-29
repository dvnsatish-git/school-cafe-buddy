import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Carrot, Utensils, Cookie, Droplet, Star, Clock } from "lucide-react";
import type { MealRecord, FoodItem } from "@shared/schema";
import { getCategoryColor, getCategoryLabel } from "@/lib/data";

interface FoodHistoryProps {
  meals: Array<MealRecord & { food: FoodItem }>;
}

const mealTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  breakfast: Apple,
  lunch: Utensils,
  snack: Cookie,
};

export function FoodHistory({ meals }: FoodHistoryProps) {
  const groupedByDate = meals.reduce((acc, meal) => {
    const date = meal.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, Array<MealRecord & { food: FoodItem }>>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return "Today";
    if (dateStr === yesterday.toISOString().split('T')[0]) return "Yesterday";
    
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  if (meals.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Utensils className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-2">No Food History Yet</h3>
        <p className="text-sm text-muted-foreground">
          Start adding your meals to see your food history here!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([date, dayMeals]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm text-muted-foreground">{formatDate(date)}</h3>
          </div>
          
          <div className="space-y-2">
            {dayMeals.map((meal) => {
              const MealIcon = mealTypeIcons[meal.mealType] || Utensils;
              return (
                <Card key={meal.id} className="p-3" data-testid={`history-item-${meal.id}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(meal.food.category)}`}>
                      <MealIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{meal.food.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {meal.mealType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">${meal.food.price.toFixed(2)}</p>
                    </div>
                    
                    {meal.food.isHealthy && meal.food.points > 0 && (
                      <div className="flex items-center gap-1 text-primary text-sm font-medium">
                        <Star className="w-4 h-4 fill-primary" />
                        <span>+{meal.food.points}</span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
