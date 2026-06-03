"use client";

import { useState, useEffect } from "react";
import {
  IconSun,
  IconSunHigh,
  IconCloud,
  IconCloudRain,
  IconUmbrella,
  IconCloudBolt,
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
  if (code >= 51 && code <= 55) return <IconCloudRain {...props} />;
  if (code >= 61 && code <= 65) return <IconUmbrella {...props} />;
  if (code >= 71 && code <= 77) return <IconSnowflake {...props} />;
  if (code >= 80 && code <= 82) return <IconUmbrella {...props} />;
  if (code >= 85 && code <= 86) return <IconSnowflake {...props} />;
  if (code >= 95) return <IconCloudBolt {...props} />;
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

  const fontSize = Math.round(40 * fontScale);
  const iconSize = Math.round(32 * fontScale);

  return (
    <div
      style={{
        fontFamily: "'Barlow', sans-serif",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: `${fontSize}px`,
      }}
    >
      <span style={{ color: accentColor }}>{dayAbbr}</span>
      <span style={{ color: "white" }}>{dateNum}</span>
      {getWeatherIcon(weatherCode, iconSize, "rgba(255,255,255,0.7)")}
      <span style={{ color: "white" }}>{tempDisplay}</span>
    </div>
  );
}
