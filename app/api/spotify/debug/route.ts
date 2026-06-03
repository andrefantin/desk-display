export const dynamic = "force-dynamic";

import { getSpotifyTokens, getValidAccessToken } from "@/lib/spotify-tokens";

export async function GET() {
  const tokens = await getSpotifyTokens();
  if (!tokens) {
    return Response.json({ step: "no_tokens", message: "No Spotify tokens found in KV" });
  }

  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return Response.json({ step: "refresh_failed", message: "Could not get valid access token", tokenExpired: Date.now() > tokens.expiresAt });
  }

  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  return Response.json({
    step: "spotify_api",
    status: res.status,
    message: res.status === 204 ? "Nothing currently playing on Spotify" : await res.text(),
  });
}
