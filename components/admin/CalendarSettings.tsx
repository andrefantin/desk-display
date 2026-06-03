"use client";

import { signIn, signOut } from "next-auth/react";
import type { DisplaySettings } from "@/lib/types";

interface CalendarSettingsProps {
  settings: DisplaySettings;
  onChange: (partial: Partial<DisplaySettings>) => void;
  session: {
    user?: { name?: string | null; email?: string | null; image?: string | null };
    accessToken?: string;
  } | null;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "6px",
  color: "white",
  fontSize: "14px",
  fontFamily: "'Barlow', sans-serif",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "rgba(255,255,255,0.6)",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontFamily: "'Barlow', sans-serif",
};

export default function CalendarSettings({
  settings,
  onChange,
  session,
}: CalendarSettingsProps) {
  return (
    <div>
      <h2
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "white",
          marginBottom: "20px",
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        Google Calendar
      </h2>

      {!session ? (
        <div>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "14px",
              marginBottom: "16px",
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            Connect your Google account to display upcoming calendar events.
          </p>
          <button
            onClick={() => signIn("google")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 20px",
              backgroundColor: "rgba(129,192,125,0.15)",
              border: "1px solid rgba(129,192,125,0.4)",
              borderRadius: "8px",
              color: "#81c07d",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Barlow', sans-serif",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(129,192,125,0.25)")
            }
            onMouseOut={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(129,192,125,0.15)")
            }
          >
            Connect Google Account
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Connected email */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              backgroundColor: "rgba(129,192,125,0.08)",
              border: "1px solid rgba(129,192,125,0.2)",
              borderRadius: "8px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#81c07d",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "2px",
                  fontFamily: "'Barlow', sans-serif",
                }}
              >
                Connected
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "white",
                  fontFamily: "'Barlow', sans-serif",
                }}
              >
                {session.user?.email ?? "Unknown"}
              </div>
            </div>
            <button
              onClick={() => signOut()}
              style={{
                padding: "8px 14px",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "'Barlow', sans-serif",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseOver={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.color = "white";
                btn.style.borderColor = "rgba(255,255,255,0.4)";
              }}
              onMouseOut={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.color = "rgba(255,255,255,0.5)";
                btn.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              Disconnect
            </button>
          </div>

          {/* Calendar ID */}
          <div>
            <label style={labelStyle}>Calendar ID</label>
            <input
              type="text"
              value={settings.calendarId}
              onChange={(e) => onChange({ calendarId: e.target.value })}
              placeholder="primary"
              style={inputStyle}
            />
            <p
              style={{
                marginTop: "6px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              Use &quot;primary&quot; for your main calendar, or enter a specific calendar
              ID.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
