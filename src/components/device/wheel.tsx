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
    (centerX: number, centerY: number, mouseX: number, mouseY: number) => {
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      return Math.atan2(dy, dx) * (180 / Math.PI);
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

      if (!wheelRef.current) return;
      setIsDragging(true);
      wheelRef.current.style.cursor = "grabbing";

      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const initialAngle = getAngle(centerX, centerY, e.clientX, e.clientY);
      setStartAngle(initialAngle);
    },
    [getAngle],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !wheelRef.current) return;

      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentMouseAngle = getAngle(
        centerX,
        centerY,
        e.clientX,
        e.clientY,
      );

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
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (wheelRef.current) {
      wheelRef.current.style.cursor = "grab";
    }
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (wheelRef.current) {
          wheelRef.current.style.cursor = "grab";
        }
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={wheelRef}
      className="relative flex h-100 w-100 cursor-grab items-center justify-center overflow-hidden rounded-full border-4 border-neutral-600 bg-gradient-to-br from-neutral-600 to-neutral-700 transition-all duration-100 ease-out select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ transform: `rotate(${currentRotation}deg)` }}
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

      <div className="absolute z-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-neutral-400 to-neutral-500 text-xl font-bold text-neutral-800"></div>
    </div>
  );
});

ScrollWheel.displayName = "ScrollWheel";

export default ScrollWheel;
