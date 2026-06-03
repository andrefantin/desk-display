"use client";

import { useState, useEffect } from "react";

interface ClockDisplayProps {
  accentColor: string;
  fontScale: number;
}

export default function ClockDisplay({
  accentColor,
  fontScale,
}: ClockDisplayProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: `calc(200px * ${fontScale})`,
        color: accentColor,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
    >
      {time}
    </div>
  );
}
