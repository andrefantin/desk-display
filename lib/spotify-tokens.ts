import { kv } from "@vercel/kv";
import type { SpotifyTokens } from "./types";

const KV_KEY = "spotify_tokens";

export async function getSpotifyTokens(): Promise<SpotifyTokens | null> {
  try {
    return await kv.get<SpotifyTokens>(KV_KEY);
  } catch {
    return null;
  }
}

export async function saveSpotifyTokens(tokens: SpotifyTokens): Promise<void> {
  await kv.set(KV_KEY, tokens);
}

export async function clearSpotifyTokens(): Promise<void> {
  await kv.del(KV_KEY);
}

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getSpotifyTokens();
  if (!tokens) return null;
  if (Date.now() > tokens.expiresAt - 5 * 60 * 1000) {
    return await refreshAccessToken(tokens.refreshToken);
  }
  return tokens.accessToken;
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID ?? "";
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? "";
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const updated: SpotifyTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    await saveSpotifyTokens(updated);
    return updated.accessToken;
  } catch {
    return null;
  }
}
