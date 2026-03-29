import { Card } from "@/components/ui/card";
import { Carrot, Apple, Star, Droplet, PiggyBank, Trophy, Lock } from "lucide-react";
import type { Badge } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Carrot,
  Apple,
  Star,
  Droplet,
  PiggyBank,
  Trophy,
};

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  progress?: number;
}

export function BadgeCard({ badge, isEarned, progress = 0 }: BadgeCardProps) {
  const IconComponent = iconMap[badge.icon] || Star;
  const progressPercent = Math.min(100, Math.round((progress / badge.pointsRequired) * 100));
  
  return (
    <Card 
      className={`relative p-4 transition-all duration-200 ${
        isEarned 
          ? "bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-300 dark:border-amber-600" 
          : "opacity-75"
      }`}
      data-testid={`badge-card-${badge.id}`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
          isEarned 
            ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white" 
            : "bg-muted text-muted-foreground"
        }`}>
          {isEarned ? (
            <IconComponent className="w-8 h-8" />
          ) : (
            <Lock className="w-6 h-6" />
          )}
          {isEarned && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-primary-foreground fill-primary-foreground" />
            </div>
          )}
        </div>
        
        <div>
          <h3 className={`font-bold text-sm ${isEarned ? "text-amber-800 dark:text-amber-200" : "text-muted-foreground"}`}>
            {badge.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
        </div>
        
        {!isEarned && (
          <div className="w-full">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{progressPercent}% complete</p>
          </div>
        )}
      </div>
    </Card>
  );
}
