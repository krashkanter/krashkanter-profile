"use client";

import { motion, AnimatePresence } from "motion/react";

import App from "~/components/device/device";
import Landing from "~/components/pages/home";
import Profile from "~/components/pages/profile";
import Files from "~/components/pages/files";
import Tools from "~/components/pages/tools";
import Contacts from "~/components/pages/contacts";
import Settings from "~/components/pages/settings";

import { useState } from "react";
import Help from "~/components/pages/help";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(0);

  const components = [
    <Landing key="landing" />,
    <Profile key="profile" />,
    <Files key="files" />,
    <Tools key="tools" />,
    <Contacts key="contacts" />,
    <Settings key="settings" />,
    <Help key="help" />,
  ];

  return (
    <main
      className={`flex max-h-screen flex-row items-center justify-between overflow-hidden bg-white text-black`}
    >
      <div className={`flex h-[100vh] max-h-screen w-1/2 flex-col`}>
        <AnimatePresence mode="wait">
          {components[selectedItem]}
        </AnimatePresence>
      </div>
      <motion.div
        initial={{ x: 800, opacity: 0 }}
        animate={{ x: 30, y: 20, rotateZ: -20, opacity: 1, scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 20,
        }}
        className="flex h-300 max-h-screen w-150 flex-col gap-8 p-8"
      >
        <App selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </motion.div>
    </main>
  );
}
