"use client";

import { motion } from "motion/react";
import { Orbitron, Meera_Inimai } from "next/font/google";
import { TextMorph } from "~/components/textMorph";
import { SquaredButton } from "../ui/Button";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
});

const meera = Meera_Inimai({
  subsets: ["latin"],
  weight: "400",
});

export default function Terminal() {
  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`${orbitron.className} flex h-1/3 items-center justify-center`}
      >
        <TextMorph
          strings={["Terminal", "For Powerusers", "Terminal"]}
          loop={false}
        />
      </motion.div>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`${meera.className} flex h-2/3 p-4 text-4xl text-black`}
      >
        <div>
          Really?
          <br />
          <br />
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex h-12 w-56 items-center justify-center rounded bg-white/80 p-4 text-xl text-black hover:cursor-pointer hover:bg-black/10 hover:text-white hover:backdrop-blur-sm"
          >
            Proceed
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
