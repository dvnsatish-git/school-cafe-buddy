import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Trophy, Star, Sparkles, ArrowRight,
  Apple, Banana, Carrot, Leaf, Salad, Wheat, Sandwich, Utensils,
  Soup, Cookie, Candy, Droplet, Milk, Wine, Citrus, Grape, CupSoda,
  Target,
} from "lucide-react";
import type { FoodItem, Badge, StudentBadge } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Apple, Banana, Citrus, Grape, Carrot, Leaf, Salad, Wheat,
  Sandwich, Utensils, Soup, Cookie, Candy, Cup: CupSoda,
  Droplet, Milk, Wine,
  Carrot2: Carrot, Star, Trophy,
};

const badgeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Carrot, Apple, Star, Droplet, PiggyBank: Trophy, Trophy,
};

const COLORS = [
  "#facc15", "#f472b6", "#60a5fa", "#4ade80",
  "#c084fc", "#fb923c", "#f87171", "#34d399",
  "#38bdf8", "#a78bfa", "#fbbf24", "#86efac",
];

// Shapes via borderRadius or clipPath
const SHAPES = [
  { borderRadius: "50%" },                                      // circle
  { borderRadius: "2px" },                                      // square
  { borderRadius: "2px", transform: "rotate(45deg)" },          // diamond
  { borderRadius: "50% 0 50% 0" },                              // teardrop
  { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" },       // blob
];

// Seed pieces deterministically so HMR doesn't re-randomize
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const PIECE_COUNT = 80;
const PIECES = Array.from({ length: PIECE_COUNT }, (_, i) => ({
  color: COLORS[i % COLORS.length],
  left: `${seededRand(i * 3) * 100}%`,
  duration: `${2.2 + seededRand(i * 7) * 1.6}s`,
  delay: `${seededRand(i * 11) * 0.9}s`,
  width: 8 + Math.floor(seededRand(i * 5) * 10),
  height: 6 + Math.floor(seededRand(i * 13) * 8),
  shape: SHAPES[i % SHAPES.length],
  swingAmt: (seededRand(i * 17) - 0.5) * 120, // px horizontal drift
}));

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("confetti-fs-style")) {
  const s = document.createElement("style");
  s.id = "confetti-fs-style";
  s.textContent = `
    @keyframes cfFall {
      0%   { opacity: 1; transform: translateY(-30px) translateX(0px) rotate(0deg); }
      100% { opacity: 0; transform: translateY(105vh) translateX(var(--swing)) rotate(900deg); }
    }
    @keyframes cfBurst {
      0%   { opacity: 0; transform: scale(0) rotate(0deg); }
      15%  { opacity: 1; transform: scale(1.4) rotate(180deg); }
      100% { opacity: 0; transform: scale(0.6) rotate(720deg) translateY(60px); }
    }
  `;
  document.head.appendChild(s);
}

function FullScreenConfetti({ active }: { active: boolean }) {
  if (!active) return null;
  return createPortal(
    <div
      aria-hidden
      style={{
        position: "fixed", inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {PIECES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: p.left,
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            ...p.shape,
            "--swing": `${p.swingAmt}px`,
            animation: `cfFall ${p.duration} ${p.delay} cubic-bezier(.25,.46,.45,.94) both`,
          } as React.CSSProperties}
        />
      ))}
      {/* Extra burst of stars from center on open */}
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={`burst-${i}`}
          style={{
            position: "absolute",
            top: "40%",
            left: `${30 + i * 2.8}%`,
            width: 14,
            height: 14,
            backgroundColor: COLORS[i % COLORS.length],
            borderRadius: "50%",
            animation: `cfBurst ${0.9 + (i % 4) * 0.15}s ${(i % 8) * 0.05}s ease-out both`,
          }}
        />
      ))}
    </div>,
    document.body
  );
}

interface SuccessDialogProps {
  isOpen: boolean;
  onDone: () => void;
  cartItems: FoodItem[];
  newBadges: Badge[];
  allBadges: Badge[];
  earnedBadgeIds: Set<string>;
  totalPointsAfter: number;
}

export function SuccessDialog({
  isOpen,
  onDone,
  cartItems,
  newBadges,
  allBadges,
  earnedBadgeIds,
  totalPointsAfter,
}: SuccessDialogProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // slight delay so dialog renders first, then animate in
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const pointsEarned = cartItems.reduce((s, f) => s + f.points, 0);
  const orderTotal = cartItems.reduce((s, f) => s + f.price, 0);

  // Next badge: lowest pointsRequired not yet earned, and not just awarded now
  const newBadgeIds = new Set(newBadges.map(b => b.id));
  const nextBadge = allBadges
    .filter(b => !earnedBadgeIds.has(b.id) && !newBadgeIds.has(b.id))
    .sort((a, b) => a.pointsRequired - b.pointsRequired)[0];

  const pointsToNext = nextBadge ? Math.max(0, nextBadge.pointsRequired - totalPointsAfter) : 0;
  const nextBadgeProgress = nextBadge
    ? Math.min(100, Math.round((totalPointsAfter / nextBadge.pointsRequired) * 100))
    : 100;

  return (
    <Dialog open={isOpen} onOpenChange={() => onDone()}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <div
          className={`relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
            visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <FullScreenConfetti active={visible} />

          {/* Hero section */}
          <div className="bg-gradient-to-br from-green-400 to-emerald-600 px-6 pt-8 pb-6 text-white text-center relative">
            <div className={`transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 ring-4 ring-white/30">
                <Trophy className="w-10 h-10 text-yellow-300 drop-shadow" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Awesome!</h2>
              <p className="text-green-100 text-sm mt-1">Your meal is all set!</p>
            </div>
          </div>

          <div className="px-5 pb-5 space-y-4 mt-4">
            {/* Points earned */}
            {pointsEarned > 0 && (
              <div className={`transition-all duration-500 delay-150 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <div className="flex items-center justify-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl py-3 px-4">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-400 animate-bounce" />
                  <div>
                    <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-400 leading-none">+{pointsEarned}</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">points earned!</p>
                  </div>
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
            )}

            {/* Order summary */}
            <div className={`transition-all duration-500 delay-200 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Your Order</p>
              <div className="bg-muted/40 rounded-xl p-3 space-y-1.5">
                {cartItems.map(food => {
                  const Icon = iconMap[food.icon] || Apple;
                  return (
                    <div key={food.id} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-sm font-medium">{food.name}</span>
                      <span className="text-xs text-muted-foreground">${food.price.toFixed(2)}</span>
                      {food.points > 0 && (
                        <span className="text-xs text-primary font-semibold">+{food.points}pts</span>
                      )}
                    </div>
                  );
                })}
                <div className="border-t pt-1.5 flex justify-between text-sm font-bold">
                  <span>Total paid</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* New badges */}
            {newBadges.length > 0 && (
              <div className={`transition-all duration-500 delay-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  New Badge{newBadges.length > 1 ? "s" : ""} Unlocked!
                </p>
                <div className="space-y-2">
                  {newBadges.map(badge => {
                    const Icon = badgeIconMap[badge.icon] || Trophy;
                    return (
                      <div
                        key={badge.id}
                        className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center shrink-0 ring-2 ring-purple-300 dark:ring-purple-600">
                          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-purple-800 dark:text-purple-200">{badge.name}</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400">{badge.description}</p>
                        </div>
                        <Sparkles className="w-5 h-5 text-purple-400 ml-auto animate-pulse shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Next badge approaching */}
            {nextBadge && (
              <div style={{ transitionDelay: "400ms" }} className={`transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Next Badge
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center shrink-0">
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-blue-800 dark:text-blue-200 truncate">{nextBadge.name}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">{nextBadge.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-blue-100 dark:bg-blue-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${nextBadgeProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 text-right">
                      {pointsToNext > 0
                        ? `${pointsToNext} more points to go!`
                        : "Almost there!"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Done button */}
            <div className={`transition-all duration-500 delay-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-base h-12 rounded-xl"
                onClick={onDone}
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
