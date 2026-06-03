"use client";

interface SpotifySettingsProps {
  connected: boolean;
}

export default function SpotifySettings({ connected }: SpotifySettingsProps) {
  return (
    <div
      style={{
        backgroundColor: "#2a2a2a",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "16px",
      }}
    >
      <h3
        style={{
          color: "white",
          margin: "0 0 12px 0",
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        Spotify
      </h3>
      {connected ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "#81c07d", fontSize: "14px" }}>
            ✓ Spotify connected
          </span>
          <a
            href="/api/spotify/auth"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              textDecoration: "underline",
            }}
          >
            Reconnect
          </a>
        </div>
      ) : (
        <a
          href="/api/spotify/auth"
          style={{
            display: "inline-block",
            backgroundColor: "#1DB954",
            color: "white",
            padding: "10px 20px",
            borderRadius: "20px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Connect Spotify
        </a>
      )}
    </div>
  );
}
