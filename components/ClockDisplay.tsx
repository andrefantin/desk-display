"use client";

import { useState, useEffect } from "react";

interface ClockDisplayProps {
  color: string;
  timeFormat: "12h" | "24h";
}

function formatClock(now: Date, timeFormat: "12h" | "24h"): string {
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  if (timeFormat === "12h") {
    let hours = now.getHours() % 12;
    if (hours === 0) hours = 12;
    return `${String(hours).padStart(2, "0")}:${minutes}:${seconds}`;
  }
  const hours = String(now.getHours()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function ClockDisplay({ color, timeFormat }: ClockDisplayProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => setTime(formatClock(new Date(), timeFormat));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timeFormat]);

  // Trim the line box to the cap height so the digits align exactly to the top
  // of the layout (mirrors Figma's text-box-trim). Set inline rather than via a
  // CSS class because Tailwind v4's Lightning CSS strips these newer properties.
  const style: React.CSSProperties = {
    fontFamily: "var(--font-concert-one), sans-serif",
    fontSize: "256px",
    lineHeight: "normal",
    color,
    textAlign: "center",
    whiteSpace: "nowrap",
  };
  const styleWithTrim = style as Record<string, string>;
  styleWithTrim.textBoxTrim = "trim-both";
  styleWithTrim.textBoxEdge = "cap alphabetic";

  return <div style={style}>{time}</div>;
}
