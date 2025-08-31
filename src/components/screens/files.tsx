"use client";

import { motion } from "motion/react";
import { Orbitron } from "next/font/google";
import { TextMorph } from "~/components/textMorph";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
});

export default function Files() {
  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className={`${orbitron.className} flex h-1/3 items-center justify-start pl-4`}
      >
        <TextMorph strings={["Files", "Get My Files and Documents"]} loop={true} />
      </motion.div>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="flex h-2/3 items-end justify-center"
      ></motion.div>
    </>
  );
}
