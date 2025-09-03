"use client";

import { motion } from "motion/react";
import { Orbitron } from "next/font/google";
import { TextMorph } from "../textMorph";
import Image from "next/image";

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
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className={`${orbitron.className} flex h-1/3 items-center justify-start pl-4`}
      >
        <TextMorph strings={["About", "You can contact me lol"]} loop={true} />
      </motion.div>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="flex h-2/3 w-[70vw] m-2 p-8"
      >
        <div className="grid grid-cols-4 gap-8 z-10">
          <motion.div whileHover={{ rotateZ: -10 }} className="flex h-40 w-40 cursor-pointer items-center justify-center rounded-3xl bg-white/80 transition-colors hover:bg-black/10">
            <span className="text-6xl"><Image src="/logos/icons8-github-squared-100.svg" alt="Stylized GitHub Logo" width={100} height={100} /></span>
          </motion.div>
          <motion.div whileHover={{ rotateZ: -10 }} className="flex h-40 w-40 cursor-pointer  items-center justify-center rounded-3xl bg-white/80 transition-colors hover:bg-black/10">
            <span className="text-6xl"><Image src="/logos/icons8-instagram.svg" alt="Stylized Instagram Logo" width={100} height={100} /></span>
          </motion.div>
          <motion.div whileHover={{ rotateZ: -10 }} className="flex h-40 w-40 cursor-pointer  items-center justify-center rounded-3xl bg-white/80 transition-colors hover:bg-black/10">
            <span className="text-6xl"><Image src="/logos/icons8-email-100.svg" alt="Stylized Email Logo" width={100} height={100} /></span>
          </motion.div>
          <motion.div whileHover={{ rotateZ: -10 }} className="flex h-40 w-40 cursor-pointer  items-center justify-center rounded-3xl bg-white/80 transition-colors hover:bg-black/10">
            <span className="text-6xl"><Image src="/logos/icons8-linkedin.svg" alt="Stylized LinkedIn Logo" width={100} height={100} /></span>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}