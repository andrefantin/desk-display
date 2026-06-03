"use client";

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

function CalendarIcon({ color }: { color: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginBottom: "16px" }}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function EventsList({
  events,
  accentColor,
  fontScale,
}: EventsListProps) {
  const timeFontSize = Math.round(20 * fontScale);
  const titleFontSize = Math.round(32 * fontScale);

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
      <CalendarIcon color={accentColor} />

      {events.length === 0 ? (
        <div
          style={{
            color: "white",
            textAlign: "center",
            fontSize: `${timeFontSize}px`,
            marginTop: "auto",
            marginBottom: "auto",
            opacity: 0.6,
          }}
        >
          No upcoming events
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {events.slice(0, 3).map((event, index) => (
            <div key={event.id}>
              {index > 0 && (
                <div
                  style={{
                    height: "1px",
                    backgroundColor: accentColor,
                    opacity: 0.4,
                    marginTop: "14px",
                    marginBottom: "14px",
                  }}
                />
              )}
              <div>
                <div
                  style={{
                    fontSize: `${timeFontSize}px`,
                    color: "white",
                    opacity: 0.7,
                    fontWeight: 400,
                    marginBottom: "4px",
                  }}
                >
                  {formatTime(event.startTime)}
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
          ))}
        </div>
      )}
    </div>
  );
}
