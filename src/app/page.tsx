"use client";

import "~/styles/morphing-gradient.css";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Device from "~/components/device/device";
import About from "~/components/screens/about";
import Files from "~/components/screens/files";
import Help from "~/components/screens/help";
import Landing from "~/components/screens/home";
import Profile from "~/components/screens/profile";
import Settings from "~/components/screens/settings";
import Projects from "~/components/screens/projects";
import Terminal from "~/components/screens/terminal";
import Image from "next/image";
import FluidSVGBackground from "~/components/fluid-svg-background";

function useIsPortrait() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(orientation: portrait)");
    const listener = () => setIsPortrait(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return isPortrait;
}
function useIsCompatibleScreenSize() {
  const [isCompatibleScreenSize, setIsCompatibleScreenSize] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsCompatibleScreenSize(
        window.innerWidth >= 1280 && window.innerHeight >= 700,
      );
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isCompatibleScreenSize;
}

function useToleranceCountExceeded() {
  const [toleranceCountExceeded, setToleranceCountExceeded] = useState(false);
  const countRef = useRef(0);
  const prevStateRef = useRef<{
    isPortrait: boolean;
    isCompatibleScreenSize: boolean;
  } | null>(null);

  useEffect(() => {
    function checkAndUpdate() {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      const isCompatibleScreenSize =
        window.innerWidth >= 1380 && window.innerHeight >= 700;

      if (prevStateRef.current === null) {
        prevStateRef.current = { isPortrait, isCompatibleScreenSize };
        return;
      }

      if (
        isPortrait !== prevStateRef.current.isPortrait ||
        isCompatibleScreenSize !== prevStateRef.current.isCompatibleScreenSize
      ) {
        countRef.current += 1;
        prevStateRef.current = { isPortrait, isCompatibleScreenSize };
      }

      if (countRef.current >= 5) {
        setToleranceCountExceeded(true);
      }
    }

    checkAndUpdate();

    window.addEventListener("resize", checkAndUpdate);
    window.addEventListener("orientationchange", checkAndUpdate);
    return () => {
      window.removeEventListener("resize", checkAndUpdate);
      window.removeEventListener("orientationchange", checkAndUpdate);
    };
  }, []);

  return toleranceCountExceeded;
}

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isPortrait = useIsPortrait();
  const isCompatibleScreenSize = useIsCompatibleScreenSize();
  const toleranceCountExceeded = useToleranceCountExceeded();

  const components = [
    <Landing key="landing" />,
    <Profile key="profile" />,
    <Files key="files" />,
    <Projects key="projects" />,
    <About key="about" />,
    <Settings key="settings" />,
    <Help key="help" />,
    <Terminal key="terminal" />,
  ];

  if (!isClient) {
    return null;
  }

  if (toleranceCountExceeded) {
    return (
      <div className="animated-gradient flex h-screen w-screen items-center justify-center text-black">
        <Image
          src="/job-application.png"
          alt="Tolerance Exceeded"
          className="h-full w-auto"
          width={1080}
          height={1398}
        />
      </div>
    );
  }

  if (isPortrait || !isCompatibleScreenSize) {
    return (
      <div className="flex h-screen w-screen items-center justify-center text-black">
        <FluidSVGBackground />
        <h1 className="text-4xl font-light">
          MINIMUM RESOLUTION 1280x700
          <br />
          CURRENT RESOLUTION {window.innerWidth}x{window.innerHeight}
        </h1>
      </div>
    );
  }

  return (
    <>
      <motion.div
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 1 }}
        // exit={{ opacity: 0 }}
        className={`flex max-h-900 min-w-300 flex-row items-center justify-between overflow-hidden text-black`}
      >
        <FluidSVGBackground />
        <div className={`flex h-[100vh] max-h-screen w-1/2 flex-col`}>
          <AnimatePresence mode="wait">
            {components[selectedItem]}
          </AnimatePresence>
        </div>
        <motion.div
          initial={{ x: 800, y: window.innerHeight / 12, opacity: 0 }}
          animate={{
            x: 10,
            y: window.innerHeight / 12,
            rotateZ: -10,
            opacity: 1,
            scale: 0.95,
          }}
          transition={{
            type: "spring",
            stiffness: 10,
            damping: 5,
          }}
          // whileHover={{ scale: 0.96 }}
          // whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{
              y: [2, -8, 2],
              x: [0, 5, -5, 0],
              rotate: [-1, 2, -1],
            }}
            transition={{
              y: {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              x: {
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              rotate: {
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
            className="flex max-h-screen flex-col gap-8 p-8 md:w-130"
          >
            <Device
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
