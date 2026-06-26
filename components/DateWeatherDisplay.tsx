"use client";

import { useState, useEffect } from "react";

interface DateWeatherDisplayProps {
  temperature: number | null;
  weatherCode: number | null;
}

const DAY_ABBRS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    temperature !== null && temperature !== undefined
      ? `${Math.round(temperature * 10) / 10}º`
      : "--º";
  const iconSrc = getWeatherIcon(weatherCode);

  return (
    <div
      style={{
        fontFamily: "var(--font-space-grotesk), sans-serif",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: "24px",
        fontSize: "32px",
        color: "#000000",
      }}
    >
      <span>
        {dayAbbr} {dateNum}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {iconSrc && (
          <img
            src={iconSrc}
            alt="weather"
            style={{ width: "40px", height: "40px", objectFit: "contain" }}
          />
        )}
        <span>{tempDisplay}</span>
      </div>
    </div>
  );
}
