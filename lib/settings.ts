import { put, list } from "@vercel/blob";
import type { DisplaySettings } from "./types";
import { DEFAULT_SETTINGS } from "./defaults";

export { DEFAULT_SETTINGS };

const SETTINGS_FILENAME = "display_settings.json";

export async function getSettings(): Promise<DisplaySettings> {
  try {
    const { blobs } = await list({ prefix: SETTINGS_FILENAME });
    if (blobs.length === 0) return DEFAULT_SETTINGS;
    const res = await fetch(blobs[0].url);
    if (!res.ok) return DEFAULT_SETTINGS;
    const data = await res.json();
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: DisplaySettings): Promise<void> {
  await put(SETTINGS_FILENAME, JSON.stringify(settings), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}
