import type { DisplaySettings } from "./types";

export const DEFAULT_SETTINGS: DisplaySettings = {
  accentColor: "#81c07d",
  backgroundColor: "#1e1e1e",
  fontScale: 1.0,
  location: {
    city: "Dublin",
    lat: 53.3498,
    lng: -6.2603,
  },
  temperatureUnit: "C",
  calendarId: "primary",
};

export async function getSettings(): Promise<DisplaySettings> {
  try {
    const { kv } = await import("@vercel/kv");
    const settings = await kv.get<DisplaySettings>("display_settings");
    if (!settings) {
      return DEFAULT_SETTINGS;
    }
    return settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: DisplaySettings): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await kv.set("display_settings", settings);
}
