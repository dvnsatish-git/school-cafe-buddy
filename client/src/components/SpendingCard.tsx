import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, AlertTriangle, CheckCircle } from "lucide-react";

interface SpendingCardProps {
  spent: number;
  budget: number;
}

export function SpendingCard({ spent, budget }: SpendingCardProps) {
  const percentage = Math.min(100, Math.round((spent / budget) * 100));
  const remaining = Math.max(0, budget - spent);
  const isNearLimit = percentage >= 80;
  const isOverLimit = spent >= budget;
  
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isOverLimit 
              ? "bg-destructive/10 text-destructive" 
              : isNearLimit 
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" 
                : "bg-primary/10 text-primary"
          }`}>
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Monthly Spending</h3>
            <p className="text-sm text-muted-foreground">Your food budget</p>
          </div>
        </div>
        
        {isOverLimit ? (
          <div className="flex items-center gap-1 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Over budget</span>
          </div>
        ) : isNearLimit ? (
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Almost there</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-primary text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>On track</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Spent</span>
          <span className="font-bold text-lg" data-testid="text-spent">${spent.toFixed(2)}</span>
        </div>
        
        <Progress 
          value={percentage} 
          className={`h-3 ${isOverLimit ? "[&>div]:bg-destructive" : isNearLimit ? "[&>div]:bg-amber-500" : ""}`}
        />
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Budget: ${budget.toFixed(2)}</span>
          <span className={`font-medium ${remaining <= 5 ? "text-destructive" : "text-primary"}`} data-testid="text-remaining">
            ${remaining.toFixed(2)} left
          </span>
        </div>
      </div>
      
      {isNearLimit && !isOverLimit && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            You're close to your monthly budget! Can you wait a few days before buying extra snacks?
          </p>
        </div>
      )}
    </Card>
  );
}
