import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TRANSCRIPT = [
  "Video",
  "is",
  "being",
  "understood",
  "by",
  "AI",
  "in",
  "real",
  "time",
];

export function ProductStoryVisual() {
  const [start, setStart] = useState(false);
  const [index, setIndex] = useState(0);

  // auto start
  useEffect(() => {
    const t = setTimeout(() => setStart(true), 600);
    return () => clearTimeout(t);
  }, []);

  // transcript streaming
  useEffect(() => {
    if (!start) return;

    if (index < TRANSCRIPT.length) {
      const t = setTimeout(() => {
        setIndex((i) => i + 1);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [start, index]);

  return (
    <div className="w-full h-[420px] flex items-center justify-center bg-black text-white relative overflow-hidden">

      {/* 🌊 LEFT: FLOATING WATER WAVEFORMS */}
      <div className="absolute left-10 flex flex-col gap-3">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="h-2 w-24 bg-blue-400/60 rounded-full"
            animate={{
              x: [0, 10, -5, 0],
              opacity: [0.4, 1, 0.5],
              scaleX: [1, 1.3, 0.9, 1],
            }}
            transition={{
              duration: 2 + i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 🌊 FLOW MOTION (water moving toward AI) */}
      <motion.div
        className="absolute left-1/4 w-32 h-[2px] bg-blue-400/40"
        animate={{
          x: [0, 120],
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* 🧠 CENTER: AI PROCESSING VORTEX */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          scale: start ? 1 : 0.8,
        }}
      >
        {/* outer glow */}
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-blue-500/20 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        {/* rotating AI core */}
        <motion.div
          className="w-20 h-20 rounded-full border border-blue-400/40"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* inner pulse */}
        <motion.div
          className="absolute w-10 h-10 rounded-full bg-blue-400/30"
          animate={{
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* 🌊 FLOW EXIT LINE */}
      <motion.div
        className="absolute right-1/4 w-32 h-[2px] bg-purple-400/40"
        animate={{
          x: [0, 120],
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* 📝 RIGHT: TRANSCRIPT EMERGENCE */}
      <div className="absolute right-10 max-w-xs text-left">
        <p className="text-sm leading-relaxed">
          {TRANSCRIPT.map((word, i) => {
            const active = i <= index;

            return (
              <motion.span
                key={i}
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{
                  opacity: active ? 1 : 0.2,
                  y: active ? 0 : 8,
                  filter: active ? "blur(0px)" : "blur(6px)",
                  color: i === index ? "#60a5fa" : "#fff",
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                {word}
              </motion.span>
            );
          })}
        </p>

        {/* subtle “writing” cursor */}
        <motion.div
          className="w-2 h-4 bg-blue-400 mt-2"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>

      {/* 🌑 cinematic overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
    </div>
  );
}