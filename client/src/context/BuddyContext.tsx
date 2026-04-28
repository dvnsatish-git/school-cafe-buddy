import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

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
    morning: "Good morning, clever one! Let's outsmart those snack cravings today!",
    addHealthy: "Sly choice! You just earned {points} points. Keep it up!",
    addUnhealthy: "Ooh, {food}! Smart move — but how about swapping it for something that gives you more energy?",
    checkout: "Mission complete! Great meal today. You are on a roll!",
    lowBudget: "Heads up! Budget getting low. Water is free at the fountain!",
    readyCheckout: "Alright! Let me pull up your order. Ready to pay!",
    voiceNoMatch: "Hmm, I did not catch that food name. Try saying something like apple or milk.",
  },
  mochi: {
    morning: "Good morning. Ready for a soft, cozy, healthy day?",
    addHealthy: "So lovely. That earned you {points} beautiful points!",
    addUnhealthy: "{food} looks yummy! But how about we add something gentle for your tummy too?",
    checkout: "Beautiful choices today. Your tummy will be so happy!",
    lowBudget: "Gently now, your budget is getting low. Water is free at the fountain!",
    readyCheckout: "Okay, let us check out now. Looking good!",
    voiceNoMatch: "Hmm, I did not quite hear that. Could you say the food name again?",
  },
  biscuit: {
    morning: "GOOD MORNING! Let us eat amazing food today, woohoo!",
    addHealthy: "YES YES YES! That is SO GOOD! You just earned {points} whole points, BOOM!",
    addUnhealthy: "Oh! {food}! How about adding some carrots too? Double win!",
    checkout: "Amazing meal! You are the best! Let us go pay!",
    lowBudget: "Whoa, budget alert! Water is FREE at the fountain!",
    readyCheckout: "CHECKOUT TIME! Let us go go go!",
    voiceNoMatch: "Woof! I did not hear a food name. Try saying apple or sandwich!",
  },
  zap: {
    morning: "System online. Nutrition mission initiated. Let us optimize today's fuel.",
    addHealthy: "Calculating. {points} points added to your total. Optimal choice confirmed.",
    addUnhealthy: "Warning. {food} detected. Recommend adding a protein or vegetable for balance.",
    checkout: "Transaction complete. Nutrition score: excellent.",
    lowBudget: "Budget alert. Twenty percent remaining. Water costs zero credits at the fountain.",
    readyCheckout: "Initiating checkout sequence. Processing your order now.",
    voiceNoMatch: "Input not recognized. Please state a valid food item name.",
  },
  ribbit: {
    morning: "Ribbit ribbit! Ready to hop into a veggie-filled day?",
    addHealthy: "Ribbit! That is a ribbiting choice! You earned {points} points, hop hop!",
    addUnhealthy: "Ooh, {food}! That is frog-tastic, but want some veggies on the side?",
    checkout: "Ribbit ribbit! Meal approved by the veggie council!",
    lowBudget: "Uh oh, your wallet is as empty as a dried-up pond! Drink free water!",
    readyCheckout: "Ribbit! Off to the checkout pond we go!",
    voiceNoMatch: "Ribbit? I did not hear a food name. Try saying broccoli or apple!",
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
  getBuddyMessage: (key: string, vars?: Record<string, string | number>) => string;
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
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

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

  const getBuddyMessage = (key: string, vars?: Record<string, string | number>): string => {
    let msg = BUDDY_MESSAGES[selectedBuddyId]?.[key] || BUDDY_MESSAGES.foxy[key] || "";
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        msg = msg.replace(`{${k}}`, String(v));
      });
    }
    return msg;
  };

  const speakMessage = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[^\x00-\x7FÀ-ɏ ]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(clean);

    const voices = voicesRef.current;

    // Per-buddy voice config — dramatic differences so kids can tell them apart
    const voiceConfig: Record<BuddyId, { rate: number; pitch: number; preferKeywords: string[] }> = {
      foxy:    { rate: 1.05, pitch: 1.15, preferKeywords: ["Google US English", "Samantha", "Karen"] },
      mochi:   { rate: 0.78, pitch: 1.35, preferKeywords: ["Google UK English Female", "Tessa", "Fiona", "Moira"] },
      biscuit: { rate: 1.45, pitch: 1.55, preferKeywords: ["Google US English", "Samantha", "Zira"] },
      zap:     { rate: 0.88, pitch: 0.40, preferKeywords: ["Google UK English Male", "Daniel", "David", "Alex"] },
      ribbit:  { rate: 0.95, pitch: 0.80, preferKeywords: ["Google Australian English", "Lee", "Rishi", "Trinoids"] },
    };

    const cfg = voiceConfig[selectedBuddyId];
    utterance.rate = cfg.rate;
    utterance.pitch = cfg.pitch;
    utterance.volume = 0.95;

    // Pick the best matching voice available
    if (voices.length > 0) {
      const match = cfg.preferKeywords
        .map(kw => voices.find(v => v.name.includes(kw)))
        .find(Boolean);
      if (match) utterance.voice = match;
    }

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
