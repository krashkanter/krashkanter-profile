"use client";

import { motion } from "motion/react";
import { Orbitron, Meera_Inimai } from "next/font/google";
import { TextMorph } from "~/components/textMorph";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
});

const meera = Meera_Inimai({
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
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${orbitron.className} flex h-1/3 items-center justify-center`}
      >
        <TextMorph strings={["KrashKanter", "Keerthan"]} loop={true} />
      </motion.div>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${meera.className} flex h-2/3 items-center justify-start p-4 text-4xl text-white`}
      >
        Scroll on the device or click sections to continue
      </motion.div>
    </>
  );
}
