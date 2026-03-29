import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet, Star, ShoppingBag, X, PartyPopper, AlertTriangle } from "lucide-react";
import type { FoodItem, Student } from "@shared/schema";

interface SpendingData {
  student: Student;
}

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cartItems: FoodItem[];
  isPending: boolean;
}

export function CheckoutDialog({ isOpen, onClose, onConfirm, cartItems, isPending }: CheckoutDialogProps) {
  const { data } = useQuery<SpendingData>({
    queryKey: ["/api/spending"],
    enabled: isOpen,
  });

  const orderTotal = cartItems.reduce((sum, f) => sum + f.price, 0);
  const totalPoints = cartItems.reduce((sum, f) => sum + f.points, 0);

  const monthlyBudget = data?.student.monthlyBudget ?? 0;
  const monthlySpent = data?.student.monthlySpent ?? 0;
  const available = Math.max(0, monthlyBudget - monthlySpent);
  const afterPurchase = available - orderTotal;
  const isOverBudget = afterPurchase < 0;

  const spentAfter = monthlySpent + orderTotal;
  const usedPercentAfter = Math.min(100, Math.round((spentAfter / monthlyBudget) * 100));
  const usedPercentBefore = Math.min(100, Math.round((monthlySpent / monthlyBudget) * 100));

  const barColor = isOverBudget
    ? "bg-red-500"
    : usedPercentAfter >= 80
    ? "bg-yellow-500"
    : "bg-green-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Time to Pay!
          </DialogTitle>
        </DialogHeader>

        {/* Wallet section */}
        <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 space-y-3">
          <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
            <Wallet className="w-5 h-5" />
            Your Wallet This Month
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total budget</span>
              <span className="font-semibold text-base">${monthlyBudget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Already spent</span>
              <span className="font-semibold text-base text-orange-600">− ${monthlySpent.toFixed(2)}</span>
            </div>
            <div className="border-t border-blue-200 dark:border-blue-700 pt-2 flex justify-between items-center">
              <span className="font-bold text-blue-700 dark:text-blue-300">Available now</span>
              <span className="font-extrabold text-xl text-blue-700 dark:text-blue-300">${available.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="rounded-2xl bg-muted/40 border p-4 space-y-2">
          <p className="font-bold text-sm">Your Order</p>
          {cartItems.map((food) => (
            <div key={food.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{food.name}</span>
              <span className="font-medium">${food.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Order total</span>
            <span className="text-lg">− ${orderTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* After purchase */}
        <div className={`rounded-2xl border-2 p-4 space-y-3 ${
          isOverBudget
            ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
            : "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
        }`}>
          {isOverBudget ? (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
              <AlertTriangle className="w-5 h-5" />
              Uh oh! Not enough money
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-bold">
              <PartyPopper className="w-5 h-5" />
              You'll have left over:
            </div>
          )}

          <div className={`text-4xl font-extrabold text-center ${
            isOverBudget ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-300"
          }`}>
            {isOverBudget ? `−$${Math.abs(afterPurchase).toFixed(2)}` : `$${afterPurchase.toFixed(2)}`}
          </div>

          {/* Budget bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Budget used after buying</span>
              <span>{usedPercentAfter}%</span>
            </div>
            <div className="h-5 bg-muted rounded-full overflow-hidden relative">
              {/* Already spent portion */}
              <div
                className="absolute top-0 left-0 h-full bg-orange-400 rounded-full transition-all"
                style={{ width: `${usedPercentBefore}%` }}
              />
              {/* New spending portion */}
              <div
                className={`absolute top-0 h-full rounded-full transition-all ${barColor}`}
                style={{ left: `${usedPercentBefore}%`, width: `${Math.min(usedPercentAfter - usedPercentBefore, 100 - usedPercentBefore)}%` }}
              />
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
                Already spent
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full inline-block ${barColor}`} />
                This order
              </span>
            </div>
          </div>
        </div>

        {/* Points */}
        {totalPoints > 0 && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 text-primary py-2.5 font-bold">
            <Star className="w-5 h-5 fill-primary" />
            You'll earn +{totalPoints} points!
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>
            <X className="w-4 h-4 mr-1" />
            Go back
          </Button>
          <Button
            className={`flex-1 font-bold text-white ${isOverBudget ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
            onClick={onConfirm}
            disabled={isPending}
            data-testid="button-confirm-checkout"
          >
            {isPending ? "Paying..." : isOverBudget ? "Pay Anyway" : "Pay Now!"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
