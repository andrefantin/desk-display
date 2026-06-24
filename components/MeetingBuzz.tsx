"use client";

import { useEffect, useState } from "react";
import type { CalendarEvent } from "@/lib/types";

interface MeetingBuzzProps {
  events: CalendarEvent[];
}

export default function MeetingBuzz({ events }: MeetingBuzzProps) {
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const checkMeetings = () => {
      const now = new Date();

      for (const event of events) {
        if (!event.startTime) continue;

        const start = new Date(event.startTime);
        const diffMs = start.getTime() - now.getTime();
        const diffMinutes = diffMs / 1000 / 60;

        if (diffMinutes >= 0 && diffMinutes <= 1) {
          const dateKey = start.toISOString().split("T")[0];
          const storageKey = `buzzed_${event.id}_${dateKey}`;

          if (!localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, "true");
            setActiveEvent(event);
            setTimeout(() => setActiveEvent(null), 60000);
            break;
          }
        }
      }
    };

    checkMeetings();
    const interval = setInterval(checkMeetings, 15000);
    return () => clearInterval(interval);
  }, [events]);

  if (!activeEvent) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#e8e8e8",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        gap: "48px",
        padding: "48px",
        fontFamily: "var(--font-space-grotesk), sans-serif",
      }}
    >
      {/* Left: text */}
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div style={{ color: "#fc4646", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
          Starting in 1 minute
        </div>
        <div
          style={{
            color: "#000000",
            fontSize: "40px",
            fontWeight: 700,
            lineHeight: 1.15,
            overflowWrap: "break-word",
          }}
        >
          {activeEvent.title}
        </div>
      </div>

      {/* Right: GIF — fixed square box so its width is predictable regardless
          of the GIF's native aspect ratio. */}
      <img
        src="https://media.giphy.com/media/MFsSDodJHKcn1jbspn/giphy.gif"
        alt="Meeting alert"
        style={{
          width: "300px",
          height: "300px",
          borderRadius: "16px",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    </div>
  );
}
