import { google } from "googleapis";
import type { CalendarEvent } from "./types";

export async function getUpcomingEvents(
  accessToken: string,
  calendarId: string
): Promise<CalendarEvent[]> {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const IGNORED_TITLES = ["home", "lunch"];

    const now = new Date().toISOString();
    const response = await calendar.events.list({
      calendarId,
      timeMin: now,
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const items = response.data.items ?? [];

    return items
      .filter((item) => {
        // Drop all-day events (they have start.date but no start.dateTime)
        if (!item.start?.dateTime) return false;
        // Drop ignored titles
        const title = (item.summary ?? "").trim().toLowerCase();
        if (IGNORED_TITLES.includes(title)) return false;
        return true;
      })
      .slice(0, 3)
      .map((item) => ({
        id: item.id ?? "",
        title: item.summary ?? "(No title)",
        startTime: item.start?.dateTime ?? "",
        endTime: item.end?.dateTime ?? "",
      }));
  } catch {
    return [];
  }
}
