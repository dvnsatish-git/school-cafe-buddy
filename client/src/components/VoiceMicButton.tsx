import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Keyboard } from "lucide-react";

interface VoiceMicButtonProps {
  onResult: (transcript: string) => void;
  onListeningChange?: (listening: boolean) => void;
}

type MicState = "idle" | "listening" | "processing";

export function VoiceMicButton({ onResult, onListeningChange }: VoiceMicButtonProps) {
  const [micState, setMicState] = useState<MicState>("idle");
  const [transcript, setTranscript] = useState("");
  const [showText, setShowText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const recognitionRef = useRef<any>(null);
  const supported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

  useEffect(() => {
    return () => { recognitionRef.current?.abort(); };
  }, []);

  const startListening = () => {
    if (!supported) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition: any = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setMicState("listening");
      setTranscript("");
      onListeningChange?.(true);
    };

    recognition.onresult = (e: any) => {
      const interim = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setTranscript(interim);
      if (e.results[e.results.length - 1].isFinal) {
        setMicState("processing");
        onResult(interim);
        setTimeout(() => {
          setMicState("idle");
          setTranscript("");
          onListeningChange?.(false);
        }, 800);
      }
    };

    recognition.onerror = () => {
      setMicState("idle");
      onListeningChange?.(false);
    };

    recognition.onend = () => {
      if (micState === "listening") {
        setMicState("idle");
        onListeningChange?.(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setMicState("idle");
    onListeningChange?.(false);
  };

  const handleMicClick = () => {
    if (micState === "listening") stopListening();
    else startListening();
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onResult(textInput.trim());
    setTextInput("");
    setShowText(false);
  };

  const isActive = micState === "listening";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Pulse rings */}
        {isActive && (
          <>
            <span className="animate-pulse-ring absolute w-20 h-20 rounded-full bg-[#4ECDC4]/30" />
            <span className="animate-pulse-ring absolute w-20 h-20 rounded-full bg-[#4ECDC4]/20" style={{ animationDelay: "0.45s" }} />
            <span className="animate-pulse-ring absolute w-20 h-20 rounded-full bg-[#4ECDC4]/10" style={{ animationDelay: "0.9s" }} />
          </>
        )}
        <motion.button
          onClick={handleMicClick}
          whileTap={{ scale: 0.92 }}
          animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={isActive ? { repeat: Infinity, duration: 1.2 } : {}}
          className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full text-white font-bold shadow-lg"
          style={{
            background: isActive
              ? "linear-gradient(135deg, #4ECDC4, #74B9FF)"
              : micState === "processing"
              ? "linear-gradient(135deg, #A29BFE, #74B9FF)"
              : "linear-gradient(135deg, #4ECDC4, #74B9FF)",
            boxShadow: isActive
              ? "0 8px 32px rgba(78,205,196,0.5)"
              : "0 4px 16px rgba(78,205,196,0.3)",
          }}
          aria-label={isActive ? "Stop listening" : "Speak your order"}
        >
          <Mic className={`w-8 h-8 ${isActive ? "animate-pulse" : ""}`} />
        </motion.button>
      </div>

      <span className="text-xs font-display font-semibold text-gray-500">
        {micState === "idle" && "🎤 Tap to speak"}
        {micState === "listening" && "🟢 Listening..."}
        {micState === "processing" && "⚡ Got it!"}
      </span>

      {/* Live transcript bubble */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl px-4 py-2 text-sm font-sans text-gray-700 shadow border border-[#4ECDC4]/30 max-w-[260px] text-center"
          >
            "{transcript}"
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text fallback */}
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 overflow-hidden"
          >
            <input
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleTextSubmit()}
              placeholder="Type your order..."
              className="rounded-full px-4 py-2 text-sm border-2 border-[#4ECDC4]/40 focus:border-[#4ECDC4] outline-none font-sans"
            />
            <button
              onClick={handleTextSubmit}
              className="px-4 py-2 rounded-full text-sm font-display font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #4ECDC4, #74B9FF)" }}
            >
              Add
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!supported && (
        <p className="text-xs text-amber-600 font-sans">
          Voice not supported in this browser — use text below.
        </p>
      )}

      <button
        onClick={() => setShowText(v => !v)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Keyboard className="w-3 h-3" />
        {showText ? "Hide keyboard" : "Type instead"}
      </button>
    </div>
  );
}
