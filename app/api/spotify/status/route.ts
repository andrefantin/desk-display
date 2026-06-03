export const dynamic = "force-dynamic";
import { getSpotifyTokens } from "@/lib/spotify-tokens";

export async function GET() {
  const tokens = await getSpotifyTokens();
  return Response.json({ connected: tokens !== null });
}
