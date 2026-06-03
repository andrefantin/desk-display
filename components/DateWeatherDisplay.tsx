"use client";

import { useState, useEffect } from "react";

interface DateWeatherDisplayProps {
  accentColor: string;
  fontScale: number;
  temperature: number | null;
  unit: "C" | "F";
  weatherCode: number | null;
}

const DAY_ABBRS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getWeatherIcon(code: number | null): string | null {
  if (code === null) return null;
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 20;

  if (code === 0) return isNight ? "/weather-icons/Clear (Night).png" : "/weather-icons/Clear (Day).png";
  if (code === 1) return "/weather-icons/Clear (Day).png";
  if (code === 2) return "/weather-icons/Partially cloudy.png";
  if (code === 3) return "/weather-icons/Cloudy.png";
  if (code === 45 || code === 48) return "/weather-icons/Cloudy.png";
  if (code >= 51 && code <= 53) return "/weather-icons/Drizzlling with sun.png";
  if (code >= 54 && code <= 55) return "/weather-icons/Drizzling.png";
  if (code >= 61 && code <= 65) return "/weather-icons/Rain.png";
  if (code >= 71 && code <= 77) return "/weather-icons/Snowing.png";
  if (code >= 80 && code <= 82) return "/weather-icons/Rain.png";
  if (code >= 85 && code <= 86) return "/weather-icons/Light snow.png";
  if (code === 95) return "/weather-icons/Thunder.png";
  if (code >= 96) return "/weather-icons/Thunderstorm.png";
  return "/weather-icons/Cloudy.png";
}

export default function DateWeatherDisplay({
  accentColor,
  fontScale,
  temperature,
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
    temperature !== null && temperature !== undefined ? `${temperature}°` : "--°";

  const fontSize = Math.round(40 * fontScale);
  const iconSize = Math.round(44 * fontScale);
  const iconSrc = getWeatherIcon(weatherCode);

  return (
    <div
      style={{
        fontFamily: "'Barlow', sans-serif",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: `${fontSize}px`,
      }}
    >
      {/* Left: day + date */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ color: accentColor }}>{dayAbbr}</span>
        <span style={{ color: "white" }}>{dateNum}</span>
      </div>

      {/* Right: weather icon + temperature */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {iconSrc && (
          <img
            src={iconSrc}
            alt="weather"
            style={{ width: `${iconSize}px`, height: `${iconSize}px`, objectFit: "contain" }}
          />
        )}
        <span style={{ color: "white" }}>{tempDisplay}</span>
      </div>
    </div>
  );
}
