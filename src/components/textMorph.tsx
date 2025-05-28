"use client";
import { useEffect, useRef, useState, useMemo } from "react";

interface TextMorphProps {
  strings: string[];
}

export const TextMorph: React.FC<TextMorphProps> = ({ strings }) => {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const texts = useMemo(() => strings, [strings]);
  const morphTime = 5;
  const cooldownTime = 1;

  const [textIndex, setTextIndex] = useState(0);
  const [morphFraction, setMorphFraction] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(cooldownTime);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

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
              if (textIndex == texts.length - 2) {
                setIsComplete(true);
                return 1;
              }
              setTextIndex(textIndex + 1);
              setCooldownRemaining(cooldownTime);
              return 0;
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
  }, [texts.length, morphTime, cooldownTime, isComplete, textIndex]);

  useEffect(() => {
    const text1Element = text1Ref.current;
    const text2Element = text2Ref.current;

    if (!text1Element || !text2Element) return;

    text1Element.textContent = texts[textIndex] ?? "";
    if (textIndex + 1 < texts.length) {
      text2Element.textContent = texts[textIndex + 1] ?? "";
    }

    if (isComplete) {
      text1Element.style.filter = "";
      text1Element.style.opacity = "0%";
      text2Element.style.filter = "";
      text2Element.style.opacity = "100%";
    } else if (cooldownRemaining > 0) {
      text1Element.style.filter = "";
      text1Element.style.opacity = "100%";
      text2Element.style.filter = "";
      text2Element.style.opacity = "0%";
    } else {
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
        <span className="absolute mt-24 inline-block w-full text-start text-6xl text-neutral-400 antialiased select-none">
          Profile
        </span>
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
