import { getServerSession } from "next-auth";
import { getSettings } from "@/lib/settings";
import { getUpcomingEvents } from "@/lib/google-calendar";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || !session.accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getSettings();
    const events = await getUpcomingEvents(
      session.accessToken,
      settings.calendarId
    );

    return Response.json(events);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
