import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Apple, Banana, Carrot, Leaf, Salad, Wheat, Sandwich, Utensils, Soup, Cookie, Candy, Droplet, Milk, Wine, Star, Plus, Check, Citrus, Grape, CupSoda } from "lucide-react";
import type { FoodItem } from "@shared/schema";
import { getCategoryColor, getCategoryLabel } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Apple,
  Banana,
  Citrus,
  Grape,
  Carrot,
  Leaf,
  Salad,
  Wheat,
  Sandwich,
  Utensils,
  Soup,
  Cookie,
  Candy,
  Cup: CupSoda,
  Droplet,
  Milk,
  Wine,
};

interface FoodCardProps {
  food: FoodItem;
  onSelect: (food: FoodItem) => void;
  isSelected?: boolean;
}

export function FoodCard({ food, onSelect, isSelected }: FoodCardProps) {
  const IconComponent = iconMap[food.icon] || Apple;
  
  return (
    <Card 
      className={`relative p-4 cursor-pointer transition-all duration-200 hover-elevate active-elevate-2 ${
        isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
      }`}
      onClick={() => onSelect(food)}
      data-testid={`food-card-${food.id}`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getCategoryColor(food.category)}`}>
          <IconComponent className="w-8 h-8" />
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-sm" data-testid={`food-name-${food.id}`}>{food.name}</h3>
          <p className="text-muted-foreground text-xs">${food.price.toFixed(2)}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Badge variant="secondary" className="text-xs">
            {getCategoryLabel(food.category)}
          </Badge>
          {food.isHealthy && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              <Star className="w-3 h-3 mr-1" />
              +{food.points}
            </Badge>
          )}
        </div>
        
        <Button
          size="sm"
          className={`w-full mt-1 ${isSelected ? "bg-green-600 hover:bg-red-500 text-white" : ""}`}
          variant={isSelected ? "default" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(food);
          }}
          data-testid={`button-select-food-${food.id}`}
        >
          {isSelected ? (
            <><Check className="w-4 h-4 mr-1" />In Cart</>
          ) : (
            <><Plus className="w-4 h-4 mr-1" />Add</>
          )}
        </Button>
      </div>
    </Card>
  );
}
