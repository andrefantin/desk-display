"use client";

import { IconMusic } from "@tabler/icons-react";
import type { SpotifyTrack } from "@/lib/types";

interface SpotifyDisplayProps {
  track: SpotifyTrack | null;
  accentColor: string;
  fontScale: number;
}

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

export default function SpotifyDisplay({
  track,
  accentColor,
  fontScale,
}: SpotifyDisplayProps) {
  if (!track || !track.isPlaying) return null;

  const progress =
    track.durationMs > 0 ? (track.progressMs / track.durationMs) * 100 : 0;
  const titleSize = Math.round(20 * fontScale);
  const artistSize = Math.round(15 * fontScale);
  const timeSize = Math.round(13 * fontScale);
  const thumbSize = Math.round(48 * fontScale);

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        {track.albumArt && (
          <img
            src={track.albumArt}
            alt="Album art"
            style={{
              width: `${thumbSize}px`,
              height: `${thumbSize}px`,
              borderRadius: "4px",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "2px",
            }}
          >
            <IconMusic
              size={Math.round(14 * fontScale)}
              color={accentColor}
              strokeWidth={1.5}
            />
            <div
              style={{
                fontSize: `${titleSize}px`,
                color: "white",
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {track.title}
            </div>
          </div>
          <div
            style={{
              fontSize: `${artistSize}px`,
              color: "rgba(255,255,255,0.55)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {track.artist}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            flex: 1,
            height: "3px",
            backgroundColor: "rgba(255,255,255,0.15)",
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
        <div
          style={{
            fontSize: `${timeSize}px`,
            color: "rgba(255,255,255,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          {formatMs(track.progressMs)} / {formatMs(track.durationMs)}
        </div>
      </div>
    </div>
  );
}
