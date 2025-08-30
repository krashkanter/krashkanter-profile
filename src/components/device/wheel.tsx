import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface ScrollWheelProps {
  onScroll: (direction: "up" | "down") => void;
}

const ScrollWheel = React.forwardRef<
  { simulateRotation: (delta: number) => void },
  ScrollWheelProps
>(({ onScroll }, ref) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const lastScrollAngle = useRef(0);
  const scrollThreshold = 30;

  useImperativeHandle(ref, () => ({
    simulateRotation: (delta: number) => {
      setCurrentRotation((prev) => prev + delta);
    },
  }));

  const getAngle = useCallback(
    (centerX: number, centerY: number, clientX: number, clientY: number) => {
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      return Math.atan2(dy, dx) * (180 / Math.PI);
    },
    [],
  );

  const getEventCoordinates = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if ("touches" in e && e.touches.length > 0) {
        return {
          clientX: e.touches[0]!.clientX,
          clientY: e.touches[0]!.clientY,
        };
      }
      return {
        clientX: (e as React.MouseEvent).clientX,
        clientY: (e as React.MouseEvent).clientY,
      };
    },
    [],
  );

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();

      // For mouse events, only handle left click
      if ("button" in e && e.button !== 0) return;

      if (!wheelRef.current) return;
      setIsDragging(true);
      wheelRef.current.style.cursor = "grabbing";

      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const { clientX, clientY } = getEventCoordinates(e);
      const initialAngle = getAngle(centerX, centerY, clientX, clientY);
      setStartAngle(initialAngle);
    },
    [getAngle, getEventCoordinates],
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging || !wheelRef.current) return;
      e.preventDefault();

      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const { clientX, clientY } = getEventCoordinates(e);
      const currentMouseAngle = getAngle(centerX, centerY, clientX, clientY);

      let deltaAngle = currentMouseAngle - startAngle;

      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;

      const newRotation = currentRotation + deltaAngle;
      setCurrentRotation(newRotation);
      setStartAngle(currentMouseAngle);

      const totalRotated = newRotation - lastScrollAngle.current;

      if (Math.abs(totalRotated) >= scrollThreshold) {
        if (totalRotated > 0) {
          onScroll("down");
        } else {
          onScroll("up");
        }
        lastScrollAngle.current = newRotation;
      }
    },
    [
      isDragging,
      startAngle,
      currentRotation,
      getAngle,
      onScroll,
      scrollThreshold,
      getEventCoordinates,
    ],
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    if (wheelRef.current) {
      wheelRef.current.style.cursor = "grab";
    }
  }, []);

  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        if (wheelRef.current) {
          wheelRef.current.style.cursor = "grab";
        }
      }
    };

    window.addEventListener("mouseup", handleGlobalEnd);
    window.addEventListener("touchend", handleGlobalEnd);
    window.addEventListener("touchcancel", handleGlobalEnd);

    return () => {
      window.removeEventListener("mouseup", handleGlobalEnd);
      window.removeEventListener("touchend", handleGlobalEnd);
      window.removeEventListener("touchcancel", handleGlobalEnd);
    };
  }, [isDragging]);

  return (
    <>
      <div
        ref={wheelRef}
        className="relative flex h-100 w-100 cursor-grab touch-none items-center justify-center overflow-hidden rounded-full border-2 border-neutral-400 bg-gradient-to-br from-neutral-100 to-neutral-300 ease-out select-none"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{
          transform: `rotate(${currentRotation}deg)`,
          touchAction: "none",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
            radial-gradient(circle at center,
              transparent 40%, /* Inner transparent part */
              rgba(255,255,255,0.05) 45%, /* Subtle inner edge */
              rgba(255,255,255,0.1) 50%, /* Middle highlight */
              rgba(255,255,255,0.05) 55%, /* Subtle outer edge */
              transparent 60% /* Outer transparent part */
            ),
            repeating-linear-gradient(
              45deg, /* Angle for the repeating lines */
              rgba(255,255,255,0.02) 0px, /* Line color */
              rgba(255,255,255,0.02) 2px, /* Line thickness */
              transparent 2px, /* Gap */
              transparent 6px /* Gap thickness */
            )
          `,
            backgroundSize: "100% 100%, 100% 100%",
            backgroundPosition: "center center",
            zIndex: 0,
            pointerEvents: "none",
          }}
        ></div>
      </div>
      <div className="absolute z-10 flex h-28 w-28 items-center justify-center rounded-full border-1 border-neutral-500 bg-gradient-to-br from-neutral-300 to-neutral-400 text-xl font-bold text-neutral-800"></div>
      <div className="absolute top-150 z-10 flex cursor-pointer items-center justify-center rounded-full text-xl font-bold text-neutral-800 transition-all duration-500 select-none hover:scale-175">
        MENU
      </div>
      <div className="absolute top-215 z-10 flex cursor-pointer items-center justify-center rounded-full text-xl font-bold text-neutral-800 transition-all duration-500 select-none hover:scale-175">
        ⏯️
      </div>
      <div className="absolute left-38 z-10 flex cursor-pointer items-center justify-center rounded-full text-xl font-bold text-neutral-800 transition-all duration-500 select-none hover:scale-175">
        ⏮️
      </div>
      <div className="absolute right-38 z-10 flex cursor-pointer items-center justify-center rounded-full text-xl font-bold text-neutral-800 transition-all duration-500 select-none hover:scale-175">
        ⏭️
      </div>
    </>
  );
});

ScrollWheel.displayName = "ScrollWheel";

export default ScrollWheel;
