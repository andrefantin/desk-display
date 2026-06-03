import { kv } from "@vercel/kv";
import type { DisplaySettings } from "./types";
import { DEFAULT_SETTINGS } from "./defaults";

export { DEFAULT_SETTINGS };

export async function getSettings(): Promise<DisplaySettings> {
  try {
    const settings = await kv.get<DisplaySettings>("display_settings");
    if (!settings) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: DisplaySettings): Promise<void> {
  await kv.set("display_settings", settings);
}
