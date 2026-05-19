"use client";

import { motion } from "framer-motion";

interface GradientOrbProps {
  color1?: string;
  color2?: string;
  size?: number;
  className?: string;
  delay?: number;
}

export default function GradientOrb({
  color1 = "#38bdf8",
  color2 = "#6366f1",
  size = 400,
  className = "",
  delay = 0,
}: GradientOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color1}, ${color2})`,
      }}
      animate={{
        scale: [0.8, 1.2, 0.8],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
