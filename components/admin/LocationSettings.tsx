"use client";

import type { DisplaySettings } from "@/lib/types";

interface LocationSettingsProps {
  settings: DisplaySettings;
  onChange: (partial: Partial<DisplaySettings>) => void;
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

export default function LocationSettings({
  settings,
  onChange,
}: LocationSettingsProps) {
  const updateLocation = (
    field: keyof DisplaySettings["location"],
    value: string | number
  ) => {
    onChange({
      location: {
        ...settings.location,
        [field]: value,
      },
    });
  };

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
        Location & Weather
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* City */}
        <div>
          <label style={labelStyle}>City Name</label>
          <input
            type="text"
            value={settings.location.city}
            onChange={(e) => updateLocation("city", e.target.value)}
            placeholder="e.g. Dublin"
            style={inputStyle}
          />
        </div>

        {/* Lat / Lng row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Latitude</label>
            <input
              type="number"
              value={settings.location.lat}
              onChange={(e) =>
                updateLocation("lat", parseFloat(e.target.value))
              }
              step="0.0001"
              placeholder="53.3498"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Longitude</label>
            <input
              type="number"
              value={settings.location.lng}
              onChange={(e) =>
                updateLocation("lng", parseFloat(e.target.value))
              }
              step="0.0001"
              placeholder="-6.2603"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Temperature Unit */}
        <div>
          <label style={labelStyle}>Temperature Unit</label>
          <div style={{ display: "flex", gap: "12px" }}>
            {(["C", "F"] as const).map((unit) => (
              <label
                key={unit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "14px",
                  color:
                    settings.temperatureUnit === unit
                      ? "white"
                      : "rgba(255,255,255,0.5)",
                  fontWeight: settings.temperatureUnit === unit ? 600 : 400,
                }}
              >
                <input
                  type="radio"
                  name="temperatureUnit"
                  value={unit}
                  checked={settings.temperatureUnit === unit}
                  onChange={() => onChange({ temperatureUnit: unit })}
                  style={{ accentColor: settings.accentColor }}
                />
                {unit === "C" ? "Celsius (°C)" : "Fahrenheit (°F)"}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
