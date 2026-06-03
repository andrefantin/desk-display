export interface DisplaySettings {
  accentColor: string;
  backgroundColor: string;
  fontScale: number;
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  temperatureUnit: "C" | "F";
  calendarId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export interface WeatherData {
  temperature: number;
  unit: "C" | "F";
  weatherCode: number;
}

export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string | null;
  progressMs: number;
  durationMs: number;
}
