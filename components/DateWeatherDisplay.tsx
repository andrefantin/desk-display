"use client";

import { useState, useEffect } from "react";

interface DateWeatherDisplayProps {
  accentColor: string;
  fontScale: number;
  temperature: number | null;
  unit: "C" | "F";
}

const DAY_ABBRS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function DateWeatherDisplay({
  accentColor,
  fontScale,
  temperature,
  unit,
}: DateWeatherDisplayProps) {
  const [dayAbbr, setDayAbbr] = useState<string>("");
  const [dateNum, setDateNum] = useState<number>(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDayAbbr(DAY_ABBRS[now.getDay()]);
      setDateNum(now.getDate());
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const tempDisplay =
    temperature !== null && temperature !== undefined
      ? `${temperature}°`
      : "--°";

  const baseFontSize = Math.round(48 * fontScale);

  return (
    <div
      style={{
        fontFamily: "'Barlow', sans-serif",
        fontWeight: 700,
      }}
    >
      <div style={{ fontSize: `${baseFontSize}px`, marginBottom: "4px" }}>
        <span style={{ color: accentColor }}>{dayAbbr}</span>
        <span style={{ color: "white" }}> {dateNum}</span>
      </div>
      <div style={{ fontSize: `${baseFontSize}px`, color: "white" }}>
        {tempDisplay}
        <span style={{ fontSize: `${Math.round(24 * fontScale)}px`, marginLeft: "4px", fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>
          °{unit}
        </span>
      </div>
    </div>
  );
}
