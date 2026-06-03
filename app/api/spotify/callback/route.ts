import { NextRequest, NextResponse } from "next/server";
import { saveSpotifyTokens } from "@/lib/spotify-tokens";
import type { SpotifyTokens } from "@/lib/types";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const baseUrl = process.env.NEXTAUTH_URL ?? "";

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/admin?spotify=error`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID ?? "";
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? "";
  const redirectUri = `${baseUrl}/api/spotify/callback`;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) {
      return NextResponse.redirect(`${baseUrl}/admin?spotify=error`);
    }

    const data = await res.json();
    const tokens: SpotifyTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    await saveSpotifyTokens(tokens);
    return NextResponse.redirect(`${baseUrl}/admin?spotify=connected`);
  } catch {
    return NextResponse.redirect(`${baseUrl}/admin?spotify=error`);
  }
}
