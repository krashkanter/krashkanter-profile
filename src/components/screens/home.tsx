"use client";

import { motion } from "motion/react";
import { Orbitron } from "next/font/google";
import { TextMorph } from "~/components/textMorph";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
});

export default function Landing() {
  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className={`${orbitron.className} flex h-1/3 items-center justify-center`}
      >
        <TextMorph strings={["KrashKanter", "Keerthan"]} loop={true} />
      </motion.div>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="flex h-2/3 -translate-x-40 items-end justify-center text-black"
      >
        THIS IS KEERTHAN
      </motion.div>
    </>
  );
}
