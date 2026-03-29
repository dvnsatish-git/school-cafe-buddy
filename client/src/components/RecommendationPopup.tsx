import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb, X, Sparkles, ShoppingCart } from "lucide-react";

interface RecommendationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: string;
  alternatives?: string[];
  onAddToCart?: (foodName: string) => void;
}

export function RecommendationPopup({ isOpen, onClose, recommendation, alternatives = [], onAddToCart }: RecommendationPopupProps) {
  const [selected, setSelected] = useState<string>(alternatives[0] ?? "");

  useEffect(() => {
    if (isOpen) setSelected(alternatives[0] ?? "");
  }, [isOpen, alternatives]);

  const handleAddToCart = () => {
    if (selected && onAddToCart) {
      onAddToCart(selected);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-recommendation">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <DialogTitle className="text-lg">A Healthy Idea!</DialogTitle>
              <DialogDescription>Here's a suggestion for you</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-center text-lg">{recommendation}</p>

          {alternatives.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {alternatives.map((alt) => (
                <button
                  key={alt}
                  onClick={() => setSelected(alt)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors border-2 ${
                    selected === alt
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700"
                  }`}
                  data-testid={`button-alt-${alt.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Sparkles className="w-3 h-3" />
                  {alt}
                </button>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1" data-testid="button-skip-recommendation">
            <X className="w-4 h-4 mr-2" />
            Skip
          </Button>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            disabled={!selected}
            data-testid="button-accept-recommendation"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
