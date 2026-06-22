"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

const COLORS = ["#fc4646", "#ffd700", "#ffffff", "#ff8c42", "#4cc9f0"];

// Fires confetti + fireworks bursts for as long as the component is mounted.
// The parent controls the duration (exactly one minute) by mounting/unmounting.
export default function MeetingsCelebration() {
  useEffect(() => {
    const fire = () => {
      // Firework burst from a random point in the upper portion of the screen.
      confetti({
        particleCount: 60,
        startVelocity: 30,
        spread: 360,
        ticks: 70,
        gravity: 1,
        origin: { x: Math.random(), y: Math.random() * 0.4 + 0.05 },
        colors: COLORS,
        disableForReducedMotion: true,
      });
      // Confetti streaming in from both bottom corners.
      confetti({
        particleCount: 25,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 },
        colors: COLORS,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 25,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 },
        colors: COLORS,
        disableForReducedMotion: true,
      });
    };

    fire();
    const interval = setInterval(fire, 400);
    return () => {
      clearInterval(interval);
      confetti.reset();
    };
  }, []);

  return null;
}
