import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type BuddyId = "foxy" | "mochi" | "biscuit" | "zap" | "ribbit";
export type BuddyState = "idle" | "happy" | "excited" | "thinking" | "sad";
export type AppMode = "game" | "chill";

export interface Buddy {
  id: BuddyId;
  name: string;
  emoji: string;
  personality: string;
  color: string;
  gradient: string;
  speechStyle: string;
}

export const BUDDIES: Buddy[] = [
  {
    id: "foxy",
    name: "Foxy",
    emoji: "🦊",
    personality: "Clever & encouraging",
    color: "#E17055",
    gradient: "from-orange-400 to-red-400",
    speechStyle: "bright",
  },
  {
    id: "mochi",
    name: "Mochi",
    emoji: "🐱",
    personality: "Calm & kawaii",
    color: "#A29BFE",
    gradient: "from-purple-400 to-pink-300",
    speechStyle: "gentle",
  },
  {
    id: "biscuit",
    name: "Biscuit",
    emoji: "🐶",
    personality: "Hyper & excited",
    color: "#FDCB6E",
    gradient: "from-yellow-400 to-amber-400",
    speechStyle: "energetic",
  },
  {
    id: "zap",
    name: "Zap",
    emoji: "🤖",
    personality: "Funny & data-driven",
    color: "#74B9FF",
    gradient: "from-blue-400 to-cyan-400",
    speechStyle: "robotic",
  },
  {
    id: "ribbit",
    name: "Ribbit",
    emoji: "🐸",
    personality: "Silly & loves veggies",
    color: "#00B894",
    gradient: "from-green-400 to-teal-400",
    speechStyle: "goofy",
  },
];

export const BUDDY_MESSAGES: Record<BuddyId, Record<string, string>> = {
  foxy: {
    morning: "Good morning, clever one! Let's outsmart those snack cravings today! 🦊✨",
    addHealthy: "Sly choice! That's +10 points in your pocket! 🦊💪",
    addUnhealthy: "Ooh sneaky pick! How about something that powers you up too? 🦊🥕",
    checkout: "Mission complete! You're on a roll! 🦊🔥",
    lowBudget: "Heads up, smart one! Budget getting low. Water is free at the fountain! 🦊💧",
  },
  mochi: {
    morning: "Good morning~ Ready for a soft, cozy, healthy day? 🐱🌸",
    addHealthy: "So lovely~ that's a wonderful choice! ✨🌸",
    addUnhealthy: "Hmm... how about we add something gentle for your tummy too? 🐱🥦",
    checkout: "Beautiful choices today~ 🐱💜",
    lowBudget: "Softly now~ your budget is getting low! 🐱💧",
  },
  biscuit: {
    morning: "GOOD MORNING!!! LET'S EAT AMAZING FOOD TODAY WOOHOO!!! 🐶🎉",
    addHealthy: "YES YES YES!!! That's SO GOOD!!! +10 points BOOM!!! 🐶⚡",
    addUnhealthy: "OOH CHIPS! How about adding some carrots too?! DOUBLE WIN!!! 🐶🥕",
    checkout: "AMAZING MEAL!!! YOU'RE THE BEST!!! 🐶🏆",
    lowBudget: "WHOA budget alert!! Water is FREE at the fountain!! 🐶💧",
  },
  zap: {
    morning: "System online. Nutrition mission initiated. Let's optimize today's fuel! 🤖⚡",
    addHealthy: "Calculating... +10 points added. Optimal choice confirmed! 🤖✅",
    addUnhealthy: "Warning: snack detected. Recommend adding protein or veggie for balance. 🤖🥦",
    checkout: "Transaction complete. Nutrition score: excellent! 🤖🏆",
    lowBudget: "Budget alert: 20% remaining. Water costs 0 credits at the fountain. 🤖💧",
  },
  ribbit: {
    morning: "Ribbit ribbit! Ready to hop into a veggie-filled day? 🐸🥦",
    addHealthy: "RIBBIT! That's a ribbiting choice! +10 points! 🐸🎉",
    addUnhealthy: "Heh, that's a frog-tastic snack! Want some veggies on the side? 🐸🥕",
    checkout: "Ribbit ribbit! Meal approved by the veggie council! 🐸👑",
    lowBudget: "Uh oh, your wallet is as empty as a dried-up pond! Drink free water! 🐸💧",
  },
};

interface BuddyContextType {
  selectedBuddy: Buddy;
  buddyState: BuddyState;
  appMode: AppMode;
  studentName: string;
  hasOnboarded: boolean;
  setBuddy: (id: BuddyId) => void;
  setBuddyState: (state: BuddyState) => void;
  setAppMode: (mode: AppMode) => void;
  setStudentName: (name: string) => void;
  completeOnboarding: (buddyId: BuddyId, name: string, mode: AppMode) => void;
  getBuddyMessage: (key: string) => string;
  speakMessage: (text: string) => void;
}

const BuddyContext = createContext<BuddyContextType | null>(null);

export function BuddyProvider({ children }: { children: ReactNode }) {
  const [selectedBuddyId, setSelectedBuddyId] = useState<BuddyId>(() => {
    return (localStorage.getItem("buddyId") as BuddyId) || "foxy";
  });
  const [buddyState, setBuddyState] = useState<BuddyState>("idle");
  const [appMode, setAppModeState] = useState<AppMode>(() => {
    return (localStorage.getItem("appMode") as AppMode) || "game";
  });
  const [studentName, setStudentNameState] = useState(() => {
    return localStorage.getItem("studentName") || "";
  });
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem("hasOnboarded") === "true";
  });

  const selectedBuddy = BUDDIES.find(b => b.id === selectedBuddyId) || BUDDIES[0];

  const setBuddy = (id: BuddyId) => {
    setSelectedBuddyId(id);
    localStorage.setItem("buddyId", id);
  };

  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    localStorage.setItem("appMode", mode);
  };

  const setStudentName = (name: string) => {
    setStudentNameState(name);
    localStorage.setItem("studentName", name);
  };

  const completeOnboarding = (buddyId: BuddyId, name: string, mode: AppMode) => {
    setBuddy(buddyId);
    setStudentName(name);
    setAppMode(mode);
    setHasOnboarded(true);
    localStorage.setItem("hasOnboarded", "true");
  };

  const getBuddyMessage = (key: string): string => {
    return BUDDY_MESSAGES[selectedBuddyId]?.[key] || BUDDY_MESSAGES.foxy[key] || "";
  };

  const speakMessage = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Strip emoji by removing characters outside the Basic Multilingual Plane
    const clean = text.replace(/[^\x00-\x7FÀ-ɏ ]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = selectedBuddyId === "biscuit" ? 1.2 : selectedBuddyId === "mochi" ? 0.85 : 1.0;
    utterance.pitch = selectedBuddyId === "zap" ? 0.7 : selectedBuddyId === "biscuit" ? 1.3 : 1.1;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const modeClass = appMode === "chill" ? "chill-mode" : "game-mode";
    document.body.classList.remove("game-mode", "chill-mode");
    document.body.classList.add(modeClass);
  }, [appMode]);

  return (
    <BuddyContext.Provider value={{
      selectedBuddy,
      buddyState,
      appMode,
      studentName,
      hasOnboarded,
      setBuddy,
      setBuddyState,
      setAppMode,
      setStudentName,
      completeOnboarding,
      getBuddyMessage,
      speakMessage,
    }}>
      {children}
    </BuddyContext.Provider>
  );
}

export function useBuddy() {
  const ctx = useContext(BuddyContext);
  if (!ctx) throw new Error("useBuddy must be used inside BuddyProvider");
  return ctx;
}
