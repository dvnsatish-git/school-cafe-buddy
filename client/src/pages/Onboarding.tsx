import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BUDDIES, BuddyId, AppMode, useBuddy } from "@/context/BuddyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Volume2 } from "lucide-react";

const FOOD_EMOJIS = ["🍎", "🥦", "🥕", "🍌", "🥗", "🍊", "🫐", "🥑", "🍇", "🌽"];

function FloatingFoodEmojis() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {FOOD_EMOJIS.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl select-none"
          initial={{ y: "110%", x: `${8 + i * 9}%`, opacity: 0 }}
          animate={{ y: "-10%", opacity: [0, 0.7, 0.7, 0] }}
          transition={{
            duration: 5 + (i % 3),
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

const pageVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export default function Onboarding() {
  const { completeOnboarding, speakMessage } = useBuddy();
  const [screen, setScreen] = useState<1 | 2 | 3>(1);
  const [selectedBuddy, setSelectedBuddy] = useState<BuddyId>("foxy");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<AppMode>("game");

  const buddy = BUDDIES.find(b => b.id === selectedBuddy)!;

  const handleComplete = () => {
    if (!name.trim()) return;
    completeOnboarding(selectedBuddy, name.trim(), mode);
  };

  const tryVoice = (buddyId: BuddyId) => {
    const b = BUDDIES.find(b => b.id === buddyId)!;
    speakMessage(`Hi! I'm ${b.name}! ${b.personality}. Let's eat great today!`);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${
        mode === "chill"
          ? "bg-gradient-to-b from-purple-50 to-pink-50"
          : "bg-gradient-to-b from-cyan-50 to-teal-50"
      }`}
    >
      <FloatingFoodEmojis />

      {/* Progress dots */}
      <div className="absolute top-8 flex gap-2">
        {[1, 2, 3].map(n => (
          <div
            key={n}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: screen === n ? 24 : 8,
              backgroundColor: screen >= n ? "var(--mint)" : "#DFE6E9",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Screen 1 — Welcome */}
        {screen === 1 && (
          <motion.div
            key="s1"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center px-6 max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="text-7xl mb-6"
            >
              🍎
            </motion.div>
            <h1 className="font-display text-4xl font-extrabold text-gray-800 mb-3 leading-tight">
              Meet Your Cafeteria Buddy!
            </h1>
            <p className="font-sans text-lg text-gray-600 mb-8">
              Eat great. Earn points. Have fun.
            </p>
            <button
              onClick={() => setScreen(2)}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-lg text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg, #4ECDC4, #74B9FF)" }}
            >
              Let's Go! <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Screen 2 — Pick Your Buddy */}
        {screen === 2 && (
          <motion.div
            key="s2"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center px-4 max-w-lg w-full"
          >
            <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">Pick Your Buddy!</h2>
            <p className="text-gray-500 mb-6 font-sans">Your companion on every healthy adventure</p>

            <div className="flex gap-3 overflow-x-auto pb-4 w-full justify-center flex-wrap">
              {BUDDIES.map(b => (
                <motion.button
                  key={b.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedBuddy(b.id)}
                  className="relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[100px]"
                  style={{
                    borderColor: selectedBuddy === b.id ? b.color : "transparent",
                    backgroundColor: selectedBuddy === b.id ? `${b.color}15` : "white",
                    boxShadow: selectedBuddy === b.id ? `0 4px 20px ${b.color}40` : "0 2px 8px rgba(0,0,0,0.06)",
                    transform: selectedBuddy === b.id ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {selectedBuddy === b.id && (
                    <span className="absolute -top-2 -right-2 text-base">✅</span>
                  )}
                  <span className="text-4xl mb-1 animate-buddy-bob inline-block">{b.emoji}</span>
                  <span className="font-display font-bold text-sm text-gray-800">{b.name}</span>
                  <span className="font-sans text-xs text-gray-500 mt-0.5">{b.personality}</span>
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => tryVoice(selectedBuddy)}
              className="flex items-center gap-2 mt-2 mb-6 text-sm font-medium px-4 py-2 rounded-full border transition-all hover:shadow"
              style={{ borderColor: buddy.color, color: buddy.color }}
            >
              <Volume2 className="w-4 h-4" />
              Try {buddy.name}'s voice!
            </button>

            <button
              onClick={() => setScreen(3)}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-lg text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
              style={{ background: `linear-gradient(135deg, ${buddy.color}, ${buddy.color}99)` }}
            >
              This is my buddy! ✅
            </button>
          </motion.div>
        )}

        {/* Screen 3 — Name & Mode */}
        {screen === 3 && (
          <motion.div
            key="s3"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center px-6 max-w-sm w-full"
          >
            <span className="text-5xl mb-4 animate-buddy-bob inline-block">{buddy.emoji}</span>
            <h2 className="font-display text-3xl font-bold text-gray-800 mb-6">Almost ready!</h2>

            <div className="w-full mb-6 text-left">
              <label className="font-display font-semibold text-gray-700 mb-2 block">What's your name?</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Type your name here..."
                className="rounded-2xl text-center font-display text-lg py-3 border-2 focus:border-[#4ECDC4]"
                onKeyDown={e => e.key === "Enter" && name.trim() && handleComplete()}
              />
            </div>

            <div className="w-full mb-8">
              <label className="font-display font-semibold text-gray-700 mb-3 block">Pick your vibe:</label>
              <div className="flex gap-3">
                {(["game", "chill"] as AppMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="flex-1 py-3 rounded-2xl font-display font-bold text-sm transition-all border-2"
                    style={{
                      borderColor: mode === m ? "#4ECDC4" : "transparent",
                      backgroundColor: mode === m
                        ? (m === "game" ? "#4ECDC420" : "#A29BFE20")
                        : "white",
                      color: mode === m ? (m === "game" ? "#4ECDC4" : "#A29BFE") : "#636E72",
                      boxShadow: mode === m ? "0 4px 16px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    {m === "game" ? "⚡ Game Mode" : "🌸 Chill Mode"}
                    <p className="text-xs font-sans font-normal mt-0.5 opacity-70">
                      {m === "game" ? "Bold & bright" : "Soft & cozy"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full font-display font-bold text-lg text-white shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${buddy.color}, #4ECDC4)` }}
            >
              {name.trim() ? `${buddy.name} is ready! Let's eat! 🍽️` : "Enter your name first..."}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
