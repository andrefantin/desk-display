"use client";

import { useState, useEffect } from "react";
import {
  IconSun,
  IconSunHigh,
  IconCloud,
  IconDroplet,
  IconDroplets,
  IconBolt,
  IconSnowflake,
} from "@tabler/icons-react";

interface DateWeatherDisplayProps {
  accentColor: string;
  fontScale: number;
  temperature: number | null;
  unit: "C" | "F";
  weatherCode: number | null;
}

const DAY_ABBRS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getWeatherIcon(code: number | null, size: number, color: string) {
  if (code === null) return null;
  const props = { size, color, strokeWidth: 1.5 };
  if (code === 0) return <IconSun {...props} />;
  if (code === 1) return <IconSunHigh {...props} />;
  if (code === 2 || code === 3) return <IconCloud {...props} />;
  if (code === 45 || code === 48) return <IconCloud {...props} />;
  if (code >= 51 && code <= 55) return <IconDroplet {...props} />;
  if (code >= 61 && code <= 65) return <IconDroplets {...props} />;
  if (code >= 71 && code <= 77) return <IconSnowflake {...props} />;
  if (code >= 80 && code <= 82) return <IconDroplets {...props} />;
  if (code >= 85 && code <= 86) return <IconSnowflake {...props} />;
  if (code >= 95) return <IconBolt {...props} />;
  return <IconCloud {...props} />;
}

export default function DateWeatherDisplay({
  accentColor,
  fontScale,
  temperature,
  unit,
  weatherCode,
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
  const iconSize = Math.round(40 * fontScale);

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}>
      <div style={{ fontSize: `${baseFontSize}px`, marginBottom: "4px" }}>
        <span style={{ color: accentColor }}>{dayAbbr}</span>
        <span style={{ color: "white" }}> {dateNum}</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: `${baseFontSize}px`,
          color: "white",
        }}
      >
        {getWeatherIcon(weatherCode, iconSize, accentColor)}
        <span>{tempDisplay}</span>
      </div>
    </div>
  );
}
