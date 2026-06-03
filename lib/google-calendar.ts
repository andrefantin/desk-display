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

    const now = new Date().toISOString();
    const response = await calendar.events.list({
      calendarId,
      timeMin: now,
      maxResults: 3,
      singleEvents: true,
      orderBy: "startTime",
    });

    const items = response.data.items ?? [];

    return items.map((item) => ({
      id: item.id ?? "",
      title: item.summary ?? "(No title)",
      startTime: item.start?.dateTime ?? item.start?.date ?? "",
      endTime: item.end?.dateTime ?? item.end?.date ?? "",
    }));
  } catch {
    return [];
  }
}
