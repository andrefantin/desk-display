export const dynamic = "force-dynamic";

import { getValidAccessToken } from "@/lib/spotify-tokens";
import type { SpotifyTrack } from "@/lib/types";

export async function GET() {
  try {
    const accessToken = await getValidAccessToken();
    if (!accessToken) return Response.json(null);

    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );

    if (res.status === 204) return Response.json(null);
    if (!res.ok) return Response.json(null);

    const data = await res.json();
    if (!data.item) return Response.json(null);

    const isEpisode = data.currently_playing_type === "episode";

    const track: SpotifyTrack = {
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: isEpisode
        ? data.item.show?.name ?? ""
        : data.item.artists?.map((a: { name: string }) => a.name).join(", ") ?? "",
      albumArt: isEpisode
        ? data.item.images?.[0]?.url ?? null
        : data.item.album?.images?.[0]?.url ?? null,
      progressMs: data.progress_ms ?? 0,
      durationMs: data.item.duration_ms,
    };

    return Response.json(track);
  } catch {
    return Response.json(null);
  }
}
