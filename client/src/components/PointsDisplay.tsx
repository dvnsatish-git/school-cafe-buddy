import { Card } from "@/components/ui/card";
import { Star, TrendingUp, Sparkles } from "lucide-react";

interface PointsDisplayProps {
  points: number;
  todayPoints?: number;
}

export function PointsDisplay({ points, todayPoints = 0 }: PointsDisplayProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          <Star className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">Total Points</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary" data-testid="text-total-points">{points}</span>
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          
          {todayPoints > 0 && (
            <div className="flex items-center gap-1 mt-1 text-sm text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span data-testid="text-today-points">+{todayPoints} today!</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
