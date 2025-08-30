"use client";

import { motion } from "motion/react";
import { Orbitron } from "next/font/google";
import { TextMorph } from "../textMorph";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
});

export default function About() {
  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: -800, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 15,
        }}
        className={`${orbitron.className} flex h-1/3 items-center justify-start pl-4`}
      >
        <TextMorph strings={["About", "You can contact me lol"]} loop={true} />
      </motion.div>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: 800, opacity: 0 }}
        whileHover={{ scale: 1.1, rotateZ: -5 }}
        transition={{ type: "spring", stiffness: 40, damping: 15 }}
        className="flex h-2/3 -translate-x-40 translate-y-10 items-end justify-center rounded-r-4xl border-1 border-neutral-200 bg-neutral-300 shadow-2xl shadow-neutral-200"
      ></motion.div>
    </>
  );
}
