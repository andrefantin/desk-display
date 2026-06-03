import { kv } from "@vercel/kv";

interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const KV_KEY = "google_tokens";

export async function saveGoogleTokens(tokens: GoogleTokens): Promise<void> {
  await kv.set(KV_KEY, tokens);
}

export async function getValidGoogleAccessToken(): Promise<string | null> {
  try {
    const tokens = await kv.get<GoogleTokens>(KV_KEY);
    if (!tokens) return null;

    if (Date.now() > tokens.expiresAt - 5 * 60 * 1000) {
      return await refreshGoogleToken(tokens.refreshToken);
    }

    return tokens.accessToken;
  } catch {
    return null;
  }
}

async function refreshGoogleToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    await saveGoogleTokens({
      accessToken: data.access_token,
      refreshToken: refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
    });

    return data.access_token;
  } catch {
    return null;
  }
}
