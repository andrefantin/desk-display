import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = parseFloat(searchParams.get("lat") ?? "53.3498");
    const lng = parseFloat(searchParams.get("lng") ?? "-6.2603");
    const unit = searchParams.get("unit") ?? "C";

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Open-Meteo returned ${response.status}`);
    }

    const data = await response.json();
    const tempC: number = data.current_weather.temperature;
    const weatherCode: number = data.current_weather.weathercode;

    let temperature: number;
    if (unit === "F") {
      temperature = Math.round(((tempC * 9) / 5 + 32) * 10) / 10;
    } else {
      temperature = tempC;
    }

    return Response.json({ temperature, unit, weatherCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
