import { Card } from "@/components/ui/card";
import { Apple, Carrot, Cookie, Droplet, TrendingUp } from "lucide-react";

interface WeeklyStatsProps {
  fruits: number;
  vegetables: number;
  snacks: number;
  water: number;
}

export function WeeklyStats({ fruits, vegetables, snacks, water }: WeeklyStatsProps) {
  const stats = [
    { label: "Fruits", value: fruits, icon: Apple, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400", goal: 5, barColor: "bg-primary" },
    { label: "Veggies", value: vegetables, icon: Carrot, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", goal: 5, barColor: "bg-primary" },
    { label: "Chips", value: snacks, icon: Cookie, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", goal: 3, reverse: true, barColor: "bg-amber-500" },
    { label: "Water", value: water, icon: Droplet, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", goal: 7, barColor: "bg-primary" },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">This Week's Progress</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const progress = Math.min(100, Math.round((stat.value / stat.goal) * 100));
          const isGood = stat.reverse ? stat.value <= stat.goal : stat.value >= stat.goal;
          
          return (
            <div key={stat.label} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">{stat.label}</span>
                  <span className={`text-lg font-bold ${isGood ? "text-primary" : ""}`}>
                    {stat.value}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${stat.barColor}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
