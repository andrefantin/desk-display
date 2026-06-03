"use client";

import { useEffect } from "react";
import type { CalendarEvent } from "@/lib/types";

interface MeetingBuzzProps {
  events: CalendarEvent[];
}

export default function MeetingBuzz({ events }: MeetingBuzzProps) {
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

            document.body.classList.add("meeting-buzz");
            setTimeout(() => {
              document.body.classList.remove("meeting-buzz");
            }, 7000);

            break;
          }
        }
      }
    };

    checkMeetings();
    const interval = setInterval(checkMeetings, 30000);
    return () => clearInterval(interval);
  }, [events]);

  return null;
}
