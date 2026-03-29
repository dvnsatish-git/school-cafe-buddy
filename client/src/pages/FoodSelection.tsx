import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FoodCard } from "@/components/FoodCard";
import { RecommendationPopup } from "@/components/RecommendationPopup";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { SuccessDialog } from "@/components/SuccessDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ShoppingCart, ArrowLeft, Sparkles, Star, Trash2, Receipt } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { FoodItem, Badge as BadgeType } from "@shared/schema";
import { getCategoryLabel, getRecommendationForFood } from "@/lib/data";

type FoodCategory = "all" | "fruit" | "vegetable" | "whole_food" | "snack" | "sugary" | "drink";

interface FoodSelectionData {
  foods: FoodItem[];
  recentSnackCount: number;
}

export default function FoodSelection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>("all");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "snack">("lunch");
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    newBadges: BadgeType[];
    allBadges: BadgeType[];
    earnedBadgeIds: Set<string>;
    totalPointsAfter: number;
    paidFoods: FoodItem[];
  } | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState("");
  const [currentAlternatives, setCurrentAlternatives] = useState<string[]>([]);
  const [pendingUnhealthyFoodId, setPendingUnhealthyFoodId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<FoodSelectionData>({
    queryKey: ["/api/foods"],
  });

  const addMealMutation = useMutation({
    mutationFn: async (foods: FoodItem[]) => {
      const responses = await Promise.all(
        foods.map(food => apiRequest("POST", "/api/meals", { foodId: food.id, mealType }))
      );
      return Promise.all(responses.map(r => r.json()));
    },
    onSuccess: async (results, foods) => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/foods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/spending"] });

      // Collect all newly awarded badges across all meal posts
      const newBadges: BadgeType[] = [];
      const seenIds = new Set<string>();
      for (const result of results) {
        for (const b of (result.newBadges ?? []) as BadgeType[]) {
          if (!seenIds.has(b.id)) { seenIds.add(b.id); newBadges.push(b); }
        }
      }

      // Fetch updated dashboard for all-badges and earned-badge list
      const dash = await fetch("/api/dashboard").then(r => r.json());
      const allBadges: BadgeType[] = dash.badges ?? [];
      const earnedBadgeIds = new Set<string>(
        (dash.earnedBadges ?? []).map((eb: { badgeId: string }) => eb.badgeId)
      );
      const totalPointsAfter: number = dash.student?.totalPoints ?? 0;

      setSuccessData({ newBadges, allBadges, earnedBadgeIds, totalPointsAfter, paidFoods: foods });
      setShowCheckout(false);
      setShowCart(false);
      setShowSuccess(true);
      setSelectedFoods([]);
    },
    onError: () => {
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFoodSelect = (food: FoodItem) => {
    const isSelected = selectedFoods.some(f => f.id === food.id);

    if (isSelected) {
      setSelectedFoods(prev => prev.filter(f => f.id !== food.id));
    } else {
      setSelectedFoods(prev => [...prev, food]);

      if (!food.isHealthy) {
        const rec = getRecommendationForFood(food.name);
        setCurrentRecommendation(rec.message);
        setCurrentAlternatives(rec.alternatives);
        setPendingUnhealthyFoodId(food.id);
        setShowRecommendation(true);
      }
    }
  };

  const handleRecommendationAddToCart = (foodName: string) => {
    const alternative = data?.foods.find(f => f.name.toLowerCase() === foodName.toLowerCase());
    setSelectedFoods(prev => {
      // Remove the unhealthy food that triggered the recommendation
      const without = pendingUnhealthyFoodId
        ? prev.filter(f => f.id !== pendingUnhealthyFoodId)
        : prev;
      // Add alternative if not already in cart
      if (alternative && !without.some(f => f.id === alternative.id)) {
        return [...without, alternative];
      }
      return without;
    });
    setPendingUnhealthyFoodId(null);
  };

  const handleCheckout = () => {
    if (selectedFoods.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please select at least one food item.",
        variant: "destructive",
      });
      return;
    }
    setShowCheckout(true);
  };

  const handleConfirmPayment = () => {
    addMealMutation.mutate(selectedFoods);
  };

  const filteredFoods = data?.foods.filter(
    food => selectedCategory === "all" || food.category === selectedCategory
  ) || [];

  const totalPrice = selectedFoods.reduce((sum, f) => sum + f.price, 0);
  const totalPoints = selectedFoods.reduce((sum, f) => sum + f.points, 0);
  const categories: FoodCategory[] = ["all", "fruit", "vegetable", "whole_food", "snack", "sugary", "drink"];

  if (isLoading) {
    return <FoodSelectionSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Choose Your Food</h1>
            <p className="text-muted-foreground">Pick healthy options to earn more points!</p>
          </div>
        </div>
        {/* Cart icon button */}
        <Button
          variant="outline"
          className="relative"
          onClick={() => setShowCart(v => !v)}
          data-testid="button-toggle-cart"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {selectedFoods.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {selectedFoods.length}
            </span>
          )}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Food grid */}
        <div className="flex-1 min-w-0">
          {/* Meal type + filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="w-full sm:w-48">
              <label className="text-sm font-medium mb-2 block">Meal Type</label>
              <Select value={mealType} onValueChange={(v) => setMealType(v as typeof mealType)}>
                <SelectTrigger data-testid="select-meal-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as FoodCategory)} className="mb-6">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
              {categories.map(cat => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-testid={`tab-${cat}`}
                >
                  {cat === "all" ? "All" : getCategoryLabel(cat)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-20">
            {filteredFoods.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                onSelect={handleFoodSelect}
                isSelected={selectedFoods.some(f => f.id === food.id)}
              />
            ))}
          </div>

          {filteredFoods.length === 0 && (
            <Card className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No foods in this category</h3>
              <p className="text-sm text-muted-foreground">Try selecting a different category!</p>
            </Card>
          )}
        </div>

        {/* Cart sidebar — visible on md+ or when toggled */}
        {(showCart || selectedFoods.length > 0) && (
          <div className="hidden md:flex flex-col w-72 shrink-0">
            <CartPanel
              selectedFoods={selectedFoods}
              totalPrice={totalPrice}
              totalPoints={totalPoints}
              mealType={mealType}
              isPending={addMealMutation.isPending}
              onRemove={(id) => setSelectedFoods(prev => prev.filter(f => f.id !== id))}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>

      {/* Mobile: fixed bottom cart bar */}
      {selectedFoods.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden p-4 bg-background/95 backdrop-blur border-t space-y-2">
          {showCart && (
            <div className="bg-card border rounded-xl p-4 mb-2 max-h-60 overflow-y-auto space-y-2">
              {selectedFoods.map(food => (
                <div key={food.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">{food.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-muted-foreground">${food.price.toFixed(2)}</span>
                    <button
                      onClick={() => setSelectedFoods(prev => prev.filter(f => f.id !== food.id))}
                      className="text-destructive hover:text-destructive/80 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold text-sm">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowCart(v => !v)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {selectedFoods.length} items · ${totalPrice.toFixed(2)}
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={addMealMutation.isPending}
              onClick={handleCheckout}
              data-testid="button-confirm-selection"
            >
              <Receipt className="w-4 h-4 mr-2" />
              {addMealMutation.isPending ? "Adding..." : "Checkout"}
            </Button>
          </div>
        </div>
      )}

      <CheckoutDialog
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onConfirm={handleConfirmPayment}
        cartItems={selectedFoods}
        isPending={addMealMutation.isPending}
      />

      {successData && (
        <SuccessDialog
          isOpen={showSuccess}
          onDone={() => { setShowSuccess(false); setLocation("/"); }}
          cartItems={successData.paidFoods}
          newBadges={successData.newBadges}
          allBadges={successData.allBadges}
          earnedBadgeIds={successData.earnedBadgeIds}
          totalPointsAfter={successData.totalPointsAfter}
        />
      )}

      <RecommendationPopup
        isOpen={showRecommendation}
        onClose={() => {
          setShowRecommendation(false);
          setPendingUnhealthyFoodId(null);
        }}
        recommendation={currentRecommendation}
        alternatives={currentAlternatives}
        onAddToCart={handleRecommendationAddToCart}
      />
    </div>
  );
}

interface CartPanelProps {
  selectedFoods: FoodItem[];
  totalPrice: number;
  totalPoints: number;
  mealType: string;
  isPending: boolean;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

function CartPanel({ selectedFoods, totalPrice, totalPoints, mealType, isPending, onRemove, onCheckout }: CartPanelProps) {
  return (
    <Card className="p-4 sticky top-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 font-semibold text-base">
        <ShoppingCart className="w-5 h-5 text-primary" />
        Your Cart
        <Badge variant="secondary" className="ml-auto">{mealType}</Badge>
      </div>

      {selectedFoods.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No items yet. Pick something!</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {selectedFoods.map(food => (
            <div key={food.id} className="flex items-center gap-2 py-1">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{food.name}</p>
                <p className="text-xs text-muted-foreground">${food.price.toFixed(2)}</p>
              </div>
              {food.points > 0 && (
                <Badge className="bg-primary/10 text-primary text-xs shrink-0">
                  <Star className="w-2.5 h-2.5 mr-0.5" />
                  +{food.points}
                </Badge>
              )}
              <button
                onClick={() => onRemove(food.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
                data-testid={`button-remove-${food.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t pt-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-semibold">${totalPrice.toFixed(2)}</span>
        </div>
        {totalPoints > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Points earned</span>
            <span className="font-semibold text-primary">+{totalPoints} pts</span>
          </div>
        )}
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="lg"
        disabled={selectedFoods.length === 0 || isPending}
        onClick={onCheckout}
        data-testid="button-confirm-selection"
      >
        <Receipt className="w-4 h-4 mr-2" />
        {isPending ? "Processing..." : "Checkout"}
      </Button>
    </Card>
  );
}

function FoodSelectionSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-10 w-full mb-6" />
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-9 w-20" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  );
}
