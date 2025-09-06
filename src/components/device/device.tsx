"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { BatteryComponent } from "~/components/device/device-stats";
import { Meera_Inimai } from "next/font/google";

const meera = Meera_Inimai({
  subsets: ["latin"],
  weight: "400",
});

export default function Device({
  selectedItem,
  setSelectedItem,
}: {
  selectedItem: number;
  setSelectedItem: React.Dispatch<React.SetStateAction<number>>;
}) {
  const menuItems = [
    "🏠 Home",
    "🧑‍💼 Profile",
    "📂 Files",
    "🛠️ Projects",
    "📞 Contacts",
    "⚙️ Preferences",
    "❓ Help",
    "💻 Terminal",
  ];

  const [isHovered, setIsHovered] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false); // State for the panel
  const displayRef = useRef<HTMLDivElement>(null);
  const scrollWheelRef = useRef<{ simulateRotation: (delta: number) => void }>(
    null,
  );
  const scrollAccumulatorRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverProgress, setHoverProgress] = useState(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hoveredIndex !== null) {
      setHoverProgress(0);
      const start = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        setHoverProgress(Math.min(elapsed / 750, 1));
      }, 16);

      hoverTimeoutRef.current = setTimeout(() => {
        setSelectedItem(hoveredIndex);
        setHoverProgress(1);
      }, 750);
    } else {
      setHoverProgress(0);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [hoveredIndex, setSelectedItem]);

  const handleScroll = useCallback(
    (direction: "up" | "down") => {
      setSelectedItem((prev) => {
        let newIndex = prev;
        if (direction === "up") {
          newIndex = (prev - 1 + menuItems.length) % menuItems.length;
        } else {
          newIndex = (prev + 1) % menuItems.length;
        }

        if (displayRef.current) {
          const itemHeight = 36;
          displayRef.current.scrollTop = newIndex * itemHeight;
        }
        return newIndex;
      });
    },
    [menuItems.length, setSelectedItem],
  );

  useEffect(() => {
    const handleWindowWheel = (e: WheelEvent) => {
      if (!isHovered) return;

      e.preventDefault();

      if (scrollWheelRef.current) {
        const rotationDelta = -e.deltaY * 0.1;
        scrollWheelRef.current.simulateRotation(rotationDelta);
      }

      scrollAccumulatorRef.current += e.deltaY;

      const SCROLL_THRESHOLD = 50;

      while (scrollAccumulatorRef.current >= SCROLL_THRESHOLD) {
        handleScroll("down");
        scrollAccumulatorRef.current -= SCROLL_THRESHOLD;
      }

      while (scrollAccumulatorRef.current <= -SCROLL_THRESHOLD) {
        handleScroll("up");
        scrollAccumulatorRef.current += SCROLL_THRESHOLD;
      }
    };

    window.addEventListener("wheel", handleWindowWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWindowWheel);
    };
  }, [handleScroll, isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex h-fit flex-col items-center justify-between gap-6 rounded-4xl border-1 border-neutral-700 bg-gradient-to-br from-neutral-600 to-neutral-900 text-black shadow-2xl shadow-neutral-800 ${meera.className}`}
    >
      <div
        className="flex w-full flex-col items-center justify-between gap-6 rounded-4xl p-2"
        style={{
          boxShadow: "inset 0 2px 60px 0px rgba(0,0,0, 0.2)",
        }}
      >
        <div className="relative mt-1 flex h-100 w-full flex-col overflow-hidden rounded-3xl border-2 border-b-5 border-neutral-600 bg-white p-4 select-none">
          <div
            className="mb-2 flex cursor-pointer flex-row items-start justify-between gap-2 px-1"
            onClick={() => setIsPanelVisible(!isPanelVisible)}
          >
            <div className="text-sm text-gray-700">Project ??</div>
            <div className="text-sm text-gray-700">
              <BatteryComponent />
            </div>
          </div>
          <div key="menu-list">
            {menuItems.map((item, index) => (
              <div
                key={item}
                onClick={() => setSelectedItem(index)}
                // onMouseEnter={() => setHoveredIndex(index)}
                // onMouseLeave={() => setHoveredIndex(null)}
                className={`relative rounded-md px-0 py-1 text-lg font-medium transition-all duration-200 ease-in-out ${
                  selectedItem === index
                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md"
                    : "text-neutral-900"
                }`}
              >
                {item}
                {/* {hoveredIndex === index && hoverProgress > 0 && hoverProgress < 1 && (
                  <div className="absolute left-0 bottom-0 h-1 rounded-b-md bg-blue-400 transition-all duration-75"
                    style={{ width: `${hoverProgress * 100}%` }}
                  />
                )} */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
