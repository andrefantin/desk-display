"use client";

import { useState, useEffect } from "react";
import { IconCalendarEvent } from "@tabler/icons-react";
import type { CalendarEvent } from "@/lib/types";

interface EventsListProps {
  events: CalendarEvent[];
  accentColor: string;
  fontScale: number;
}

function formatTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
  } catch {
    return "";
  }
}

function isOngoing(startTime: string, endTime: string, now: Date): boolean {
  if (!startTime || !endTime) return false;
  const start = new Date(startTime);
  const end = new Date(endTime);
  return now >= start && now <= end;
}

export default function EventsList({
  events,
  accentColor,
  fontScale,
}: EventsListProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const timeFontSize = Math.round(20 * fontScale);
  const titleFontSize = Math.round(28 * fontScale);

  return (
    <div
      style={{
        fontFamily: "'Barlow', sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingTop: "8px",
      }}
    >
      <IconCalendarEvent
        size={28}
        color={accentColor}
        strokeWidth={1.5}
        style={{ marginBottom: "16px" }}
      />

      {events.length === 0 ? (
        <div
          style={{
            color: "white",
            fontSize: `${timeFontSize}px`,
            marginTop: "8px",
            lineHeight: 1.5,
            opacity: 0.8,
          }}
        >
          You&apos;re all clear —<br />
          no meetings left today!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {events.slice(0, 3).map((event, index) => {
            const ongoing = isOngoing(event.startTime, event.endTime, now);
            return (
              <div key={event.id}>
                {index > 0 && (
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: accentColor,
                      opacity: 0.3,
                      marginTop: "12px",
                      marginBottom: "12px",
                    }}
                  />
                )}
                <div
                  style={{
                    padding: ongoing ? "8px 10px" : "0",
                    borderRadius: ongoing ? "6px" : "0",
                    backgroundColor: ongoing ? `${accentColor}22` : "transparent",
                    borderLeft: ongoing ? `3px solid ${accentColor}` : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: `${timeFontSize}px`,
                      color: ongoing ? accentColor : "white",
                      opacity: ongoing ? 1 : 0.7,
                      fontWeight: ongoing ? 600 : 400,
                      marginBottom: "2px",
                    }}
                  >
                    {ongoing ? "NOW  " : ""}{formatTime(event.startTime)}
                  </div>
                  <div
                    style={{
                      fontSize: `${titleFontSize}px`,
                      color: "white",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {event.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
