"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-fuchsia-400 to-cyan-neon shadow-[0_0_18px_rgba(124,92,255,0.7)]"
      style={{ scaleX }}
    />
  );
}
