"use client";
import { useEffect, useRef, useState, useMemo } from "react";

interface TextMorphProps {
  strings: string[];
  /**
   * Determines if the animation should loop indefinitely.
   * @default false
   */
  loop?: boolean;
}

export const TextMorph: React.FC<TextMorphProps> = ({
  strings,
  loop = false,
}) => {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  // useMemo is great here to prevent re-calculations if the parent component re-renders with the same strings array.
  const texts = useMemo(() => strings, [strings]);
  const morphTime = 5;
  const cooldownTime = 1;

  const [textIndex, setTextIndex] = useState(0);
  const [morphFraction, setMorphFraction] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(cooldownTime);
  // isComplete is now only relevant when loop is false.
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Stop the animation if it's complete (and we are not looping)
      if (isComplete) {
        return;
      }

      setCooldownRemaining((prevCooldown) => {
        if (prevCooldown > 0) {
          return Math.max(0, prevCooldown - dt);
        } else {
          setMorphFraction((prevMorph) => {
            const newMorph = prevMorph + dt / morphTime;
            if (newMorph >= 1) {
              const nextIndex = textIndex + 1;

              // CHANGE 1: Logic to handle looping or stopping
              if (!loop && nextIndex >= texts.length - 1) {
                // If not looping and we've reached the end, mark as complete.
                setIsComplete(true);
                return 1; // Keep the final text fully morphed
              } else {
                // If looping, or not yet at the end, calculate the next index.
                // The modulo operator (%) ensures the index wraps around to 0 for looping.
                setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
                setCooldownRemaining(cooldownTime);
                return 0; // Reset morph for the next transition
              }
            }
            return newMorph;
          });
          return 0;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
    // Added 'loop' to the dependency array.
  }, [texts.length, morphTime, cooldownTime, isComplete, textIndex, loop]);

  useEffect(() => {
    const text1Element = text1Ref.current;
    const text2Element = text2Ref.current;

    if (!text1Element || !text2Element) return;

    // Set the content for the current and next text elements
    text1Element.textContent = texts[textIndex] ?? "";

    // CHANGE 2: Use modulo to get the next text, which handles the loop from the last to the first string.
    const nextTextIndex = (textIndex + 1) % texts.length;
    text2Element.textContent = texts[nextTextIndex] ?? "";

    // The rest of this effect handles the visual styling based on animation state.
    if (isComplete) {
      // Final state for one-time animation
      text1Element.style.filter = "";
      text1Element.style.opacity = "0%";
      text2Element.style.filter = "";
      text2Element.style.opacity = "100%";
    } else if (cooldownRemaining > 0) {
      // Cooldown state (text is stable)
      text1Element.style.filter = "";
      text1Element.style.opacity = "100%";
      text2Element.style.filter = "";
      text2Element.style.opacity = "0%";
    } else {
      // Morphing state
      const easeInOut = (t: number) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const eased = easeInOut(morphFraction);

      const t1Opacity = Math.pow(1 - eased, 0.4);
      const t1Blur = eased > 0 ? Math.min(8 / (1 - eased + 0.1) - 8, 100) : 0;

      text1Element.style.opacity = `${t1Opacity * 100}%`;
      text1Element.style.filter = `blur(${Math.max(0, t1Blur)}px)`;

      const t2Opacity = Math.pow(eased, 0.4);
      const t2Blur = eased < 1 ? Math.min(8 / (eased + 0.1) - 8, 100) : 0;

      text2Element.style.opacity = `${t2Opacity * 100}%`;
      text2Element.style.filter = `blur(${Math.max(0, t2Blur)}px)`;
    }
  }, [textIndex, morphFraction, cooldownRemaining, texts, isComplete]);

  return (
    <>
      <div
        id="container"
        className={`top-0 bottom-0 h-32 w-screen`}
        style={{ filter: "url(#threshold) blur(0.3px)" }}
      >
        <span
          id="text1"
          ref={text1Ref}
          className="absolute inline-block w-full bg-gradient-to-r from-blue-800 via-blue-400 to-blue-900 bg-clip-text text-start text-8xl text-transparent antialiased select-none"
        ></span>
        <span
          id="text2"
          ref={text2Ref}
          className="absolute inline-block w-full bg-gradient-to-r from-blue-800 via-blue-400 to-blue-900 bg-clip-text text-start text-8xl text-transparent antialiased select-none"
        ></span>
      </div>
      <svg id="filters" className="absolute h-0 w-0">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};