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
        backgroundColor: "#1e1e1e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        gap: "24px",
      }}
    >
      <img
        src="https://media.giphy.com/media/MFsSDodJHKcn1jbspn/giphy.gif"
        alt="Meeting alert"
        style={{ width: "480px", borderRadius: "12px" }}
      />
      <div
        style={{
          fontFamily: "'Barlow', sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#81c07d", fontSize: "20px", fontWeight: 600 }}>
          Starting in 1 minute
        </div>
        <div style={{ color: "white", fontSize: "32px", fontWeight: 700, marginTop: "6px" }}>
          {activeEvent.title}
        </div>
      </div>
    </div>
  );
}
