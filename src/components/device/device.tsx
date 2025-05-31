import React, { useRef, useEffect, useCallback, useState } from "react";

import ScrollWheel from "~/components/device/wheel";
import BatteryComponent from "~/components/device/battery";

export default function App({
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
    "🛠️ Tools",
    "📞 Contacts",
    "⚙️ Preferences",
    "❓ Help",
  ];

  const [isHovered, setIsHovered] = useState(false);

  const displayRef = useRef<HTMLDivElement>(null);
  const scrollWheelRef = useRef<{ simulateRotation: (delta: number) => void }>(
    null,
  );

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
      const scrollDirection = e.deltaY > 0 ? "down" : "up";
      handleScroll(scrollDirection);

      if (scrollWheelRef.current) {
        const rotationDelta = -e.deltaY * 0.1;
        scrollWheelRef.current.simulateRotation(rotationDelta);
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
      className="flex h-fit flex-col items-center justify-between gap-6 rounded-4xl border-1 border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-400 text-black shadow-2xl shadow-neutral-300"
    >
      <div
        className="flex w-full flex-col items-center justify-between gap-6 rounded-4xl p-4"
        style={{
          boxShadow: "inset 0 2px 60px 0px rgba(0,0,0, 0.2)",
        }}
      >
        <div className="pointer-events-none mb-12 flex h-100 w-full flex-col rounded-3xl border-2 border-b-5 border-neutral-600 bg-white p-4 select-none">
          <div className="mb-2 flex flex-row items-start justify-between gap-2 px-1">
            <div className="text-sm text-gray-700">Project ??</div>
            <div className="text-sm text-gray-700">
              <BatteryComponent />
            </div>
          </div>
          <div
            ref={displayRef}
            className="flex-grow overflow-y-scroll scroll-smooth pr-2"
          >
            {" "}
            {menuItems.map((item, index) => (
              <div
                key={item}
                className={`rounded-md px-0 py-1 text-lg font-medium transition-all duration-200 ease-in-out ${selectedItem === index ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md" : "text-neutral-900 hover:bg-gray-800"}`}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="flex flex-row items-center justify-between px-1">
            <div className="text-sm text-gray-400">Protoype Build 0.1.0</div>
            <div className="mt-2 text-right text-sm text-gray-400">
              Selected: {menuItems[selectedItem]}
            </div>
          </div>
        </div>
        <div className="m-10 flex h-1/2 w-full items-center justify-center">
          <ScrollWheel ref={scrollWheelRef} onScroll={handleScroll} />
        </div>
      </div>
    </div>
  );
}
