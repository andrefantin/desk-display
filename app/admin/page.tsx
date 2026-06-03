"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ThemeSettings from "@/components/admin/ThemeSettings";
import LocationSettings from "@/components/admin/LocationSettings";
import CalendarSettings from "@/components/admin/CalendarSettings";
import type { DisplaySettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/settings";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<DisplaySettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch {
        // use defaults
      }
    };

    if (status === "authenticated") {
      loadSettings();
    }
  }, [status]);

  const handleChange = (partial: Partial<DisplaySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaveMessage({ type: "success", text: "Settings saved successfully" });
      } else {
        const data = await res.json();
        setSaveMessage({
          type: "error",
          text: data.error ?? "Failed to save settings",
        });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Network error — could not save" });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#1e1e1e",
          color: "#81c07d",
          fontFamily: "'Barlow', sans-serif",
          fontSize: "16px",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            border: "2px solid rgba(129,192,125,0.3)",
            borderTopColor: "#81c07d",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginRight: "12px",
          }}
        />
        Loading...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
        fontFamily: "'Barlow', sans-serif",
        color: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#81c07d",
              marginBottom: "4px",
            }}
          >
            DeskDisplay
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "white",
              margin: 0,
            }}
          >
            Settings
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {saveMessage && (
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 500,
                backgroundColor:
                  saveMessage.type === "success"
                    ? "rgba(129,192,125,0.15)"
                    : "rgba(255,80,80,0.15)",
                border: `1px solid ${
                  saveMessage.type === "success"
                    ? "rgba(129,192,125,0.4)"
                    : "rgba(255,80,80,0.4)"
                }`,
                color:
                  saveMessage.type === "success" ? "#81c07d" : "#ff6b6b",
              }}
            >
              {saveMessage.text}
            </div>
          )}

          <a
            href="/display"
            style={{
              padding: "10px 18px",
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            View Display
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 24px",
              backgroundColor: saving ? "rgba(129,192,125,0.5)" : "#81c07d",
              border: "none",
              borderRadius: "8px",
              color: "#1e1e1e",
              fontSize: "14px",
              fontWeight: 700,
              cursor: saving ? "default" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <section
          style={{
            padding: "28px",
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <ThemeSettings settings={settings} onChange={handleChange} />
        </section>

        <section
          style={{
            padding: "28px",
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <LocationSettings settings={settings} onChange={handleChange} />
        </section>

        <section
          style={{
            padding: "28px",
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <CalendarSettings
            settings={settings}
            onChange={handleChange}
            session={session}
          />
        </section>
      </div>
    </div>
  );
}
