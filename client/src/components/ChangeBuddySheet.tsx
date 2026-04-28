import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BUDDIES, BuddyId, useBuddy } from "@/context/BuddyContext";
import { Check, Volume2 } from "lucide-react";

interface ChangeBuddySheetProps {
  trigger: React.ReactNode;
}

export function ChangeBuddySheet({ trigger }: ChangeBuddySheetProps) {
  const { selectedBuddy, setBuddy, speakMessage } = useBuddy();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<BuddyId | null>(null);

  const handleSelect = (id: BuddyId) => {
    setBuddy(id);
    const b = BUDDIES.find(b => b.id === id)!;
    speakMessage(`Hi! I am ${b.name}! ${b.personality}. Let us eat great today!`);
    setTimeout(() => setOpen(false), 900);
  };

  const handlePreviewVoice = (e: React.MouseEvent, id: BuddyId) => {
    e.stopPropagation();
    const b = BUDDIES.find(b => b.id === id)!;
    setPreview(id);
    speakMessage(`Hi! I am ${b.name}!`);
    setTimeout(() => setPreview(null), 1500);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto px-4 pb-8">
        <SheetHeader className="mb-4">
          <SheetTitle className="font-display text-2xl font-extrabold text-center">
            Pick Your Buddy
          </SheetTitle>
          <p className="text-center text-sm text-muted-foreground font-sans">
            Tap a buddy to switch. Tap the speaker to hear their voice!
          </p>
        </SheetHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BUDDIES.map(b => {
            const isSelected = selectedBuddy.id === b.id;
            return (
              <motion.button
                key={b.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSelect(b.id)}
                className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-left w-full"
                style={{
                  borderColor: isSelected ? b.color : "transparent",
                  backgroundColor: isSelected ? `${b.color}18` : "white",
                  boxShadow: isSelected
                    ? `0 4px 20px ${b.color}40`
                    : "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {isSelected && (
                  <span
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: b.color }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}

                <span
                  className={`text-5xl ${isSelected ? "animate-buddy-bob" : ""} inline-block`}
                >
                  {b.emoji}
                </span>

                <div className="text-center">
                  <p className="font-display font-bold text-gray-800">{b.name}</p>
                  <p className="font-sans text-xs text-gray-500 mt-0.5 leading-tight">{b.personality}</p>
                </div>

                <button
                  onClick={(e) => handlePreviewVoice(e, b.id)}
                  className="flex items-center gap-1 text-xs font-display font-semibold px-3 py-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: preview === b.id ? b.color : `${b.color}20`,
                    color: preview === b.id ? "white" : b.color,
                  }}
                >
                  <Volume2 className="w-3 h-3" />
                  {preview === b.id ? "Playing..." : "Hear voice"}
                </button>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedBuddy && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-2xl text-center font-sans text-sm"
              style={{ backgroundColor: `${selectedBuddy.color}15`, color: selectedBuddy.color }}
            >
              <span className="font-display font-semibold">
                {selectedBuddy.emoji} {selectedBuddy.name} is your current buddy!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
