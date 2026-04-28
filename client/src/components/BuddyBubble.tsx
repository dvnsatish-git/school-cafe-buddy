import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuddy, BuddyState } from "@/context/BuddyContext";
import { X, Volume2 } from "lucide-react";

const STATE_ANIMATION: Record<BuddyState, string> = {
  idle: "animate-buddy-bob",
  happy: "animate-buddy-bounce",
  excited: "animate-buddy-spin",
  thinking: "animate-buddy-tilt",
  sad: "animate-buddy-droop",
};

export function BuddyBubble() {
  const { selectedBuddy, buddyState, getBuddyMessage, speakMessage } = useBuddy();
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  useEffect(() => {
    if (!hasGreeted) {
      const hour = new Date().getHours();
      const key = hour < 12 ? "morning" : "morning";
      const msg = getBuddyMessage(key);
      const timer = setTimeout(() => {
        setMessage(msg);
        setShowMessage(true);
        setHasGreeted(true);
        const hideTimer = setTimeout(() => setShowMessage(false), 5000);
        return () => clearTimeout(hideTimer);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTap = () => {
    if (showMessage) {
      setShowMessage(false);
      return;
    }
    const keys = ["morning", "addHealthy", "checkout"];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const msg = getBuddyMessage(randomKey);
    setMessage(msg);
    setShowMessage(true);
    speakMessage(msg);
    const timer = setTimeout(() => setShowMessage(false), 5000);
    return () => clearTimeout(timer);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (message) speakMessage(message);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="relative max-w-[220px] rounded-2xl bg-white px-4 py-3 text-sm font-sans shadow-lg"
            style={{
              border: `2px solid ${selectedBuddy.color}`,
              boxShadow: `0 8px 32px ${selectedBuddy.color}40`,
            }}
          >
            <p className="font-display font-semibold text-gray-800 leading-snug pr-4">{message}</p>
            <button
              onClick={(e) => { e.stopPropagation(); setShowMessage(false); }}
              className="absolute top-1.5 right-1.5 rounded-full p-0.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
            <button
              onClick={handleSpeak}
              className="mt-2 flex items-center gap-1 text-xs font-medium opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: selectedBuddy.color }}
            >
              <Volume2 className="w-3 h-3" />
              Listen
            </button>
            {/* speech bubble tail */}
            <div
              className="absolute -bottom-2 right-6 w-3 h-3 rotate-45"
              style={{ backgroundColor: "white", border: `2px solid ${selectedBuddy.color}`, borderTop: "none", borderLeft: "none" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleTap}
        whileTap={{ scale: 0.92 }}
        className="relative flex items-center justify-center rounded-full text-4xl select-none cursor-pointer"
        style={{
          width: 72,
          height: 72,
          background: `linear-gradient(135deg, ${selectedBuddy.color}, ${selectedBuddy.color}cc)`,
          boxShadow: `0 8px 32px ${selectedBuddy.color}55`,
        }}
        aria-label={`Talk to ${selectedBuddy.name}`}
      >
        {/* pulse rings when excited */}
        {(buddyState === "excited" || buddyState === "happy") && (
          <>
            <span
              className="animate-pulse-ring absolute inset-0 rounded-full"
              style={{ backgroundColor: `${selectedBuddy.color}40` }}
            />
            <span
              className="animate-pulse-ring absolute inset-0 rounded-full"
              style={{ backgroundColor: `${selectedBuddy.color}25`, animationDelay: "0.4s" }}
            />
          </>
        )}
        <span className={STATE_ANIMATION[buddyState]} style={{ display: "inline-block" }}>
          {selectedBuddy.emoji}
        </span>
      </motion.button>
    </div>
  );
}
