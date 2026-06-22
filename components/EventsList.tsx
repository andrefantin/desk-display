"use client";

import { useState, useEffect } from "react";
import type { CalendarEvent } from "@/lib/types";

interface EventsListProps {
  events: CalendarEvent[];
  accentColor: string;
  timeFormat: "12h" | "24h";
  celebrating: boolean;
}

function formatStart(isoString: string, timeFormat: "12h" | "24h"): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const minutes = String(date.getMinutes()).padStart(2, "0");
    if (timeFormat === "12h") {
      let hours = date.getHours() % 12;
      const ampm = date.getHours() >= 12 ? "pm" : "am";
      if (hours === 0) hours = 12;
      return `${String(hours).padStart(2, "0")}:${minutes}${ampm}`;
    }
    const hours = String(date.getHours()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "";
  }
}

function formatDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return "";
  const ms = new Date(endTime).getTime() - new Date(startTime).getTime();
  if (!Number.isFinite(ms) || ms <= 0) return "";
  const totalMin = Math.round(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}m`;
}

function isOngoing(startTime: string, endTime: string, now: Date): boolean {
  if (!startTime || !endTime) return false;
  return now >= new Date(startTime) && now <= new Date(endTime);
}

function getProgress(startTime: string, endTime: string, now: Date): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.min(100, Math.max(0, ((now.getTime() - start) / (end - start)) * 100));
}

export default function EventsList({
  events,
  accentColor,
  timeFormat,
  celebrating,
}: EventsListProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  if (events.length === 0) {
    // While the celebration is running the page shows fireworks instead.
    if (celebrating) return null;
    return (
      <div
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "109px",
          boxSizing: "border-box",
          padding: "16px 20px",
          border: "1px solid #ffffff",
          borderRadius: "16px",
        }}
      >
        <span
          style={{
            fontWeight: 500,
            fontSize: "16px",
            color: "#000000",
            opacity: 0.5,
            textAlign: "center",
          }}
        >
          You don’t have more meetings today
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "stretch", width: "100%" }}>
      {events.slice(0, 3).map((event) => {
        const ongoing = isOngoing(event.startTime, event.endTime, now);
        const progress = ongoing ? getProgress(event.startTime, event.endTime, now) : 0;
        const duration = formatDuration(event.startTime, event.endTime);
        return (
          <div
            key={event.id}
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 500,
              flex: "1 1 0",
              minWidth: 0,
              maxWidth: "436px",
              display: "flex",
              flexDirection: "column",
              gap: "21px",
              padding: "16px 20px",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
              backgroundColor: ongoing ? "#ffffff" : "transparent",
              border: ongoing ? "1px solid transparent" : "1px solid #ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "21px",
                alignItems: "flex-start",
                fontSize: "16px",
                color: "#000000",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {event.title}
              </span>
              {duration && <span style={{ flexShrink: 0 }}>{duration}</span>}
            </div>
            <div style={{ fontSize: "28px", color: "#000000" }}>
              {formatStart(event.startTime, timeFormat)}
            </div>
            {ongoing && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: `${progress}%`,
                  height: "4px",
                  backgroundColor: accentColor,
                  transition: "width 30s linear",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
