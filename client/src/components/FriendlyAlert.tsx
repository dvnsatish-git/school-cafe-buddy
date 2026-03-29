import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, Heart, X } from "lucide-react";

type AlertType = "tip" | "encouragement" | "recommendation";

interface FriendlyAlertProps {
  type: AlertType;
  message: string;
  onDismiss?: () => void;
}

const alertStyles: Record<AlertType, { bg: string; icon: React.ComponentType<{ className?: string }>; title: string }> = {
  tip: {
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    icon: Lightbulb,
    title: "Helpful Tip!",
  },
  encouragement: {
    bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    icon: Sparkles,
    title: "Great Job!",
  },
  recommendation: {
    bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    icon: Heart,
    title: "Try This!",
  },
};

export function FriendlyAlert({ type, message, onDismiss }: FriendlyAlertProps) {
  const style = alertStyles[type];
  const IconComponent = style.icon;
  
  return (
    <Card className={`relative p-4 ${style.bg} border`} data-testid={`alert-${type}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-card flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{style.title}</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        
        {onDismiss && (
          <Button
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
            onClick={onDismiss}
            data-testid="button-dismiss-alert"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
