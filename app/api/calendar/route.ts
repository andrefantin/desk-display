export const dynamic = "force-dynamic";

import { getValidGoogleAccessToken } from "@/lib/google-tokens";
import { getSettings } from "@/lib/settings";
import { getUpcomingEvents } from "@/lib/google-calendar";

export async function GET() {
  try {
    const accessToken = await getValidGoogleAccessToken();

    if (!accessToken) {
      return Response.json({ error: "No Google account connected" }, { status: 401 });
    }

    const settings = await getSettings();
    const events = await getUpcomingEvents(accessToken, settings.calendarId);

    return Response.json(events);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
