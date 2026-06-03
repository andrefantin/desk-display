"use client";

import { useState, useEffect, useCallback } from "react";
import ClockDisplay from "@/components/ClockDisplay";
import DateWeatherDisplay from "@/components/DateWeatherDisplay";
import EventsList from "@/components/EventsList";
import MeetingBuzz from "@/components/MeetingBuzz";
import SpotifyDisplay from "@/components/SpotifyDisplay";
import type { DisplaySettings, WeatherData, CalendarEvent, SpotifyTrack } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/defaults";

const DISPLAY_WIDTH = 960;
const DISPLAY_HEIGHT = 540;

export default function DisplayPage() {
  const [settings, setSettings] = useState<DisplaySettings>(DEFAULT_SETTINGS);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);

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
      const res = await fetch(
        `/api/weather?lat=${lat}&lng=${lng}&unit=${unit}`
      );
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
          backgroundColor: "#1e1e1e",
          color: "#81c07d",
          fontFamily: "'Oswald', sans-serif",
          fontSize: "24px",
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
        backgroundColor: settings.backgroundColor,
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${DISPLAY_WIDTH}px`,
          height: `${DISPLAY_HEIGHT}px`,
          backgroundColor: settings.backgroundColor,
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: "top left",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Left panel ~55% */}
        <div
          style={{
            width: "55%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px 24px 48px 48px",
          }}
        >
          <ClockDisplay
            accentColor={settings.accentColor}
            fontScale={settings.fontScale}
          />
          <div>
            <DateWeatherDisplay
              accentColor={settings.accentColor}
              fontScale={settings.fontScale}
              temperature={weather?.temperature ?? null}
              unit={settings.temperatureUnit}
              weatherCode={weather?.weatherCode ?? null}
            />
            <div style={{ marginTop: "16px" }}>
              <SpotifyDisplay
                track={track}
                accentColor={settings.accentColor}
                fontScale={settings.fontScale}
              />
            </div>
          </div>
        </div>

        {/* Right panel ~45% */}
        <div
          style={{
            width: "45%",
            display: "flex",
            flexDirection: "column",
            padding: "32px 48px 48px 24px",
            borderLeft: `1px solid ${settings.accentColor}22`,
          }}
        >
          <EventsList
            events={events}
            accentColor={settings.accentColor}
            fontScale={settings.fontScale}
          />
        </div>
      </div>

      <MeetingBuzz events={events} />
    </div>
  );
}
