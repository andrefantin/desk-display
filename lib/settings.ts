import { promises as fs } from "fs";
import path from "path";
import type { DisplaySettings } from "./types";
import { DEFAULT_SETTINGS } from "./defaults";

export { DEFAULT_SETTINGS };

const SETTINGS_PATH = path.join("/tmp", "display_settings.json");

export async function getSettings(): Promise<DisplaySettings> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: DisplaySettings): Promise<void> {
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings), "utf-8");
}
