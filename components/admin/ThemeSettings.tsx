"use client";

import type { DisplaySettings } from "@/lib/types";

interface ThemeSettingsProps {
  settings: DisplaySettings;
  onChange: (partial: Partial<DisplaySettings>) => void;
}

export default function ThemeSettings({
  settings,
  onChange,
}: ThemeSettingsProps) {
  const fontScalePercent = Math.round(settings.fontScale * 100);

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
        Theme
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Accent Color */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            Accent Color
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => onChange({ accentColor: e.target.value })}
              style={{
                width: "48px",
                height: "36px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.15)",
                backgroundColor: "transparent",
                cursor: "pointer",
                padding: "2px",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "monospace",
              }}
            >
              {settings.accentColor}
            </span>
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            Background Color
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              style={{
                width: "48px",
                height: "36px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.15)",
                backgroundColor: "transparent",
                cursor: "pointer",
                padding: "2px",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "monospace",
              }}
            >
              {settings.backgroundColor}
            </span>
          </div>
        </div>

        {/* Font Scale */}
        <div>
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            <span>Font Scale</span>
            <span style={{ color: settings.accentColor }}>
              {fontScalePercent}%
            </span>
          </label>
          <input
            type="range"
            min={0.8}
            max={1.2}
            step={0.05}
            value={settings.fontScale}
            onChange={(e) =>
              onChange({ fontScale: parseFloat(e.target.value) })
            }
            style={{ width: "100%", accentColor: settings.accentColor }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              marginTop: "4px",
            }}
          >
            <span>80%</span>
            <span>100%</span>
            <span>120%</span>
          </div>
        </div>

        {/* Mini Preview */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            Preview
          </label>
          <div
            style={{
              width: "480px",
              height: "270px",
              overflow: "hidden",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                width: "960px",
                height: "540px",
                backgroundColor: settings.backgroundColor,
                transform: "scale(0.5)",
                transformOrigin: "top left",
                display: "flex",
                alignItems: "flex-end",
                padding: "32px 24px 48px 48px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: `calc(340px * ${settings.fontScale})`,
                    color: settings.accentColor,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  09:41
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: `${Math.round(48 * settings.fontScale)}px`,
                    fontWeight: 700,
                    marginTop: "16px",
                  }}
                >
                  <span style={{ color: settings.accentColor }}>WED</span>
                  <span style={{ color: "white" }}> 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
