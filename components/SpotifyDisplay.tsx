"use client";

import type { SpotifyTrack } from "@/lib/types";

interface SpotifyDisplayProps {
  track: SpotifyTrack | null;
  accentColor: string;
  // When true, render on a solid light-gray card (used over the video
  // background in the no-meetings state).
  card?: boolean;
}

export default function SpotifyDisplay({
  track,
  accentColor,
  card = false,
}: SpotifyDisplayProps) {
  if (!track) return null;

  const progress =
    track.durationMs > 0 ? (track.progressMs / track.durationMs) * 100 : 0;

  return (
    <div
      style={{
        fontFamily: "var(--font-space-grotesk), sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        maxWidth: "283px",
        ...(card
          ? { backgroundColor: "#e8e8e8", padding: "16px", borderRadius: "12px" }
          : {}),
      }}
    >
      {track.albumArt && (
        <img
          src={track.albumArt}
          alt="Album art"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover",
            borderRadius: "4px",
            flexShrink: 0,
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "6px",
          flex: "1 1 0",
          minWidth: 0,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#000000",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {track.title}
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {track.artist}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "2px",
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: accentColor,
              borderRadius: "2px",
              transition: "width 1s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
