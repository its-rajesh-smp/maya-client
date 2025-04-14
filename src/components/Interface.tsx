import { AnimatePresence, motion } from "framer-motion";
import { Brain, Mic, AudioWaveform as Waveform } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/socket.context";
import useSocketListener from "../hooks/useSocketListener.hook";
import useVoiceRecognition from "../hooks/useVoiceRecognition.hook";
import { getAiContext, setAiContext } from "../utils/aiContext.util";

function Interface() {
  const [status, setStatus] = useState("idle");
  const [started, setStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { socket } = useSocket();

  useSocketListener("save-context", onMessageReceived);
  useSocketListener("voice", onVoiceReceived);
  useSocketListener("status", (status: any) => setStatus(status));
  const { userSpeaking, start } = useVoiceRecognition();

  // Pause audio when user is speaking
  useEffect(() => {
    if (audioRef.current && userSpeaking) {
      audioRef.current.pause();
    }
  }, [userSpeaking]);

  const onConnectToMaya = () => {
    if (socket) {
      socket.emit("start", { context: getAiContext() });
      start();
    }
  };

  function onMessageReceived(context: any) {
    setAiContext(context);
  }

  function onVoiceReceived(audioBuffer: ArrayBuffer) {
    const blob = new Blob([audioBuffer], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);
    setStatus("speaking");
    const audio = new Audio(url);
    audioRef.current = audio;
    audioRef.current.play();
    audio.onended = () => setStatus("idle");
  }

  const toggleListening = () => {
    setStarted(!started);
    if (!started) {
      onConnectToMaya();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-blue-500/10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Gradient Waves */}
        <motion.div
          className="absolute inset-0 opacity-30"
          initial={{ backgroundPosition: "0% 0%" }}
          animate={{ backgroundPosition: "100% 100%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
            backgroundSize: "100% 100%",
          }}
        />

        {/* Animated Lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent w-full"
            initial={{ y: Math.random() * window.innerHeight, scaleX: 0 }}
            animate={{
              scaleX: [0, 1, 0],
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
        <AnimatePresence></AnimatePresence>
      </div>

      {/* Central Button and Status Indicators */}
      <div className="relative h-[300px] flex items-center justify-center">
        {/* Thinking Animation */}
        <AnimatePresence>
          {status === "thinking" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-4 border-blue-500 border-t-transparent"
              />
              <Brain
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500"
                size={32}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className=" flex relative justify-center items-center">
          {/* Voice Waves Animation */}
          <AnimatePresence>
            {started && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute  w-full h-full "
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                    className="absolute w-full h-full top-0  rounded-full border-2 border-blue-400"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center ${
              started ? "bg-red-500" : "bg-blue-500"
            } shadow-lg transition-colors duration-300 backdrop-blur-sm`}
          >
            {started ? (
              <Waveform className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </motion.button>
        </div>

        {/* Button Glow Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute w-24 h-24 rounded-full ${
            userSpeaking ? "bg-red-500" : "bg-blue-500"
          } filter blur-xl z-0 opacity-30`}
        />
      </div>

      {/* Status Bar */}
      <div className="h-16 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 flex items-center justify-center relative z-10">
        <motion.div
          animate={{
            color: userSpeaking
              ? "#ef4444"
              : status === "thinking"
              ? "#3b82f6"
              : "#ffffff",
          }}
          className="text-sm font-medium"
        >
          {userSpeaking
            ? "Listening..."
            : status === "thinking"
            ? "Thinking..."
            : status === "idle"
            ? "Idle"
            : status === "speaking"
            ? "Speaking..."
            : "Tap to speak"}
        </motion.div>
      </div>
    </div>
  );
}

export default Interface;
