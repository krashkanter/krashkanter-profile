"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import App from "~/components/device/device";
import About from "~/components/screens/about";
import Files from "~/components/screens/files";
import Help from "~/components/screens/help";
import Landing from "~/components/screens/home";
import Profile from "~/components/screens/profile";
import Settings from "~/components/screens/settings";
import Tools from "~/components/screens/tools";

function useIsPortrait() {
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(orientation: portrait)").matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia("(orientation: portrait)");
    const listener = () => setIsPortrait(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return isPortrait;
}

function useIsCompatibleScreenSize() {
  const [isCompatibleScreenSize, setIsCompatibleScreenSize] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1380px)").matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1380px)");
    const listener = () => setIsCompatibleScreenSize(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return isCompatibleScreenSize;
}


export default function Home() {
  const [selectedItem, setSelectedItem] = useState(0);
  const isPortrait = useIsPortrait();
  const isCompatibleScreenSize = useIsCompatibleScreenSize();

  const components = [
    <Landing key="landing" />,
    <Profile key="profile" />,
    <Files key="files" />,
    <Tools key="tools" />,
    <About key="about" />,
    <Settings key="settings" />,
    <Help key="help" />,
  ];

  if (isPortrait && !isCompatibleScreenSize) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-black">
        <h1 className="text-2xl font-bold">Please rotate your device to landscape mode.</h1>
      </div>
    );
  }

  return (
    <>
      <main
        className={`flex max-h-900 min-w-300 flex-row items-center justify-between overflow-hidden bg-white text-black`}
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
          className="flex h-300 max-h-screen w-130 flex-col gap-8 p-8"
        >
          <App selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        </motion.div>
      </main>
    </>
  );
}
