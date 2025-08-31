"use client";

import { motion } from "motion/react";
import { Orbitron } from "next/font/google";
import { TextMorph } from "../textMorph";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
});

export default function Settings() {
  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className={`${orbitron.className} flex h-1/3 items-center justify-start pl-4`}
      >
        <TextMorph strings={["Preferences", "Nothing here yet lol", "Preferences"]} loop={false} />
      </motion.div>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="flex h-2/3 items-end justify-center"
      >
        Page Still under construction
      </motion.div>
    </>
  );
}
