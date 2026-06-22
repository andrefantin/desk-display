"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ClockDisplay from "@/components/ClockDisplay";
import DateWeatherDisplay from "@/components/DateWeatherDisplay";
import EventsList from "@/components/EventsList";
import MeetingBuzz from "@/components/MeetingBuzz";
import MeetingsCelebration from "@/components/MeetingsCelebration";
import SpotifyDisplay from "@/components/SpotifyDisplay";
import type { DisplaySettings, WeatherData, CalendarEvent, SpotifyTrack } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/defaults";

const DISPLAY_WIDTH = 960;
const DISPLAY_HEIGHT = 540;

// Design palette (Figma) — kept independent of stored theme settings so the
// display always renders the intended look.
const BG_COLOR = "#e8e8e8";
const ACCENT_COLOR = "#fc4646";
const CONTENT_WIDTH = 885;
const TIME_FORMAT_KEY = "deskDisplayTimeFormat";
const LAST_MEETING_END_KEY = "deskDisplayLastMeetingEnd";
const CELEBRATION_MS = 60 * 1000;

type TimeFormat = "12h" | "24h";

function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export default function DisplayPage() {
  const [settings, setSettings] = useState<DisplaySettings>(DEFAULT_SETTINGS);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("24h");

  useEffect(() => {
    const stored = localStorage.getItem(TIME_FORMAT_KEY);
    if (stored === "12h" || stored === "24h") setTimeFormat(stored);
  }, []);

  const toggleTimeFormat = useCallback((next: TimeFormat) => {
    setTimeFormat(next);
    localStorage.setItem(TIME_FORMAT_KEY, next);
  }, []);

  // The end time of the last meeting we've seen today, so we can run the
  // celebration for exactly one minute right after it ends — even though the
  // calendar API drops events once they're over.
  const lastMeetingEndRef = useRef<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_MEETING_END_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { date: string; end: number };
        if (parsed.date === todayKey()) lastMeetingEndRef.current = parsed.end;
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const ends = events
      .map((e) => new Date(e.endTime).getTime())
      .filter((n) => Number.isFinite(n));
    if (ends.length === 0) return;
    const maxEnd = Math.max(...ends);
    lastMeetingEndRef.current = maxEnd;
    try {
      localStorage.setItem(
        LAST_MEETING_END_KEY,
        JSON.stringify({ date: todayKey(), end: maxEnd })
      );
    } catch {
      // ignore
    }
  }, [events]);

  useEffect(() => {
    const tick = () => {
      const lastEnd = lastMeetingEndRef.current;
      const active =
        events.length === 0 &&
        lastEnd !== null &&
        Date.now() >= lastEnd &&
        Date.now() - lastEnd < CELEBRATION_MS;
      setCelebrating((prev) => (prev === active ? prev : active));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [events]);

  const updateScale = useCallback(() => {
    const ratio = Math.min(
      window.innerWidth / DISPLAY_WIDTH,
      window.innerHeight / DISPLAY_HEIGHT
    );
    setScale(ratio);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        return data as DisplaySettings;
      }
    } catch {
      // use defaults
    }
    return DEFAULT_SETTINGS;
  }, []);

  const fetchWeather = useCallback(async (s: DisplaySettings) => {
    try {
      const { lat, lng } = s.location;
      const unit = s.temperatureUnit;
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}&unit=${unit}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchTrack = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify");
      if (res.ok) {
        const data = await res.json();
        setTrack(data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let weatherInterval: NodeJS.Timeout;
    let eventsInterval: NodeJS.Timeout;
    let trackInterval: NodeJS.Timeout;

    const init = async () => {
      const s = await fetchSettings();
      await fetchWeather(s);
      await fetchEvents();
      fetchTrack();
      setLoading(false);

      weatherInterval = setInterval(() => fetchWeather(s), 10 * 60 * 1000);
      eventsInterval = setInterval(fetchEvents, 2 * 60 * 1000);
      trackInterval = setInterval(fetchTrack, 15 * 1000);
    };

    init();

    return () => {
      clearInterval(weatherInterval);
      clearInterval(eventsInterval);
      clearInterval(trackInterval);
    };
  }, [fetchSettings, fetchWeather, fetchEvents, fetchTrack]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          backgroundColor: BG_COLOR,
          color: ACCENT_COLOR,
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "24px",
          fontWeight: 700,
        }}
      >
        Loading...
      </div>
    );
  }

  const offsetX = (window.innerWidth - DISPLAY_WIDTH * scale) / 2;
  const offsetY = (window.innerHeight - DISPLAY_HEIGHT * scale) / 2;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: BG_COLOR,
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${DISPLAY_WIDTH}px`,
          height: `${DISPLAY_HEIGHT}px`,
          backgroundColor: BG_COLOR,
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: "top left",
          fontFamily: "var(--font-space-grotesk), sans-serif",
        }}
      >
        {/* Clock */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <ClockDisplay color={ACCENT_COLOR} timeFormat={timeFormat} />
        </div>

        {/* Date / weather + 12h/24h toggle */}
        <div
          style={{
            position: "absolute",
            top: "239px",
            left: "50%",
            transform: "translateX(-50%)",
            width: `${CONTENT_WIDTH}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <DateWeatherDisplay
            temperature={weather?.temperature ?? null}
            weatherCode={weather?.weatherCode ?? null}
          />
          <TimeFormatToggle value={timeFormat} onChange={toggleTimeFormat} />
        </div>

        {/* Full-width divider between the date row and the meetings section */}
        <div
          style={{
            position: "absolute",
            top: "305px",
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "#ffffff",
          }}
        />

        {/* "Meetings today" label + now playing */}
        <div
          style={{
            position: "absolute",
            top: "335px",
            left: "50%",
            transform: "translateX(-50%)",
            width: `${CONTENT_WIDTH}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              color: "#000000",
            }}
          >
            Meetings today
          </span>
          <SpotifyDisplay track={track} accentColor={ACCENT_COLOR} />
        </div>

        {/* Meeting cards */}
        <div
          style={{
            position: "absolute",
            top: "391px",
            left: "50%",
            transform: "translateX(-50%)",
            width: `${CONTENT_WIDTH}px`,
          }}
        >
          <EventsList
            events={events}
            accentColor={ACCENT_COLOR}
            timeFormat={timeFormat}
            celebrating={celebrating}
          />
        </div>
      </div>

      {celebrating && <MeetingsCelebration />}

      <MeetingBuzz events={events} />
    </div>
  );
}

function TimeFormatToggle({
  value,
  onChange,
}: {
  value: TimeFormat;
  onChange: (next: TimeFormat) => void;
}) {
  const formats: TimeFormat[] = ["12h", "24h"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: "1000px",
        padding: "1px",
        overflow: "hidden",
      }}
    >
      {formats.map((format) => {
        const active = value === format;
        return (
          <button
            key={format}
            type="button"
            onClick={() => onChange(format)}
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              padding: "8px",
              border: "none",
              cursor: "pointer",
              borderRadius: "1000px",
              backgroundColor: active ? ACCENT_COLOR : "transparent",
              color: active ? "#ffffff" : ACCENT_COLOR,
            }}
          >
            {format}
          </button>
        );
      })}
    </div>
  );
}
