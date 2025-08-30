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
  const [isPanelVisible, setIsPanelVisible] = useState(false); // State for the panel
  const displayRef = useRef<HTMLDivElement>(null);
  const scrollWheelRef = useRef<{ simulateRotation: (delta: number) => void }>(
    null,
  );
  const scrollAccumulatorRef = useRef(0);

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
      className="flex h-fit flex-col items-center justify-between gap-6 rounded-4xl border-1 border-neutral-300 bg-gradient-to-br from-neutral-500 to-neutral-800 text-black shadow-2xl shadow-neutral-300"
    >
      <div
        className="flex w-full flex-col items-center justify-between gap-6 rounded-4xl p-4"
        style={{
          boxShadow: "inset 0 2px 60px 0px rgba(0,0,0, 0.2)",
        }}
      >
        <div className="relative mt-12 flex h-100 w-full flex-col overflow-hidden rounded-3xl border-2 border-b-5 border-neutral-600 bg-white p-4 select-none">
          {isPanelVisible && (
            <div className="absolute top-0 left-0 right-0 z-10 h-full bg-slate-100 p-4 transition-all">
              <div className="mb-4 text-lg font-bold text-slate-800">
                Quick Panel
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center gap-1 rounded-lg bg-blue-500 p-2 text-white">
                  <span>📶</span>
                  <span className="text-xs">Wi-Fi</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-slate-400 p-2 text-white">
                  <span>🔇</span>
                  <span className="text-xs">Silent</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-blue-500 p-2 text-white">
                  <span>‎‎‎bluetooth</span>
                  <span className="text-xs">BT</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-slate-400 p-2 text-white">
                  <span>🔄️</span>
                  <span className="text-xs">Rotate</span>
                </div>
              </div>
              <div className="my-4 border-t border-slate-300"></div>
              <div className="text-center text-sm text-slate-500">
                No new notifications
              </div>
            </div>
          )}

          <div
            className="mb-2 flex cursor-pointer flex-row items-start justify-between gap-2 px-1"
            onClick={() => setIsPanelVisible(!isPanelVisible)}
          >
            <div className="text-sm text-gray-700">Project ??</div>
            <div className="text-sm text-gray-700">
              <BatteryComponent />
            </div>
          </div>
          <div
            ref={displayRef}
            className="flex-grow overflow-y-scroll scroll-smooth pr-2"
          >
            {menuItems.map((item, index) => (
              <div
                key={item}
                onClick={() => setSelectedItem(index)}
                className={`rounded-md px-0 py-1 text-lg font-medium transition-all duration-200 ease-in-out cursor-pointer ${
                  selectedItem === index
                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md"
                    : "text-neutral-900"
                }`}
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
      </div>
    </div>
  );
}