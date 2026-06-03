# DeskDisplay

DeskDisplay is an ambient desk display application that turns any screen into a always-on information panel showing the current time, date, weather, and upcoming Google Calendar events. It features a dark aesthetic with a configurable accent color, a web-based admin panel for settings, and a meeting-start notification animation.

---

## What it does

- `/display` — Full-screen ambient display with clock, date, temperature, and calendar events
- `/admin` — Settings panel to configure theme colors, font scale, location, weather units, and Google Calendar
- Meeting buzz — The display pulses with a green animation when a calendar event starts within 1 minute

---

## Prerequisites

- Node.js 18 or higher
- A Google Cloud Console account (free)
- A Vercel account (free tier works)

---

## Google Cloud Console Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a new project.
2. In the left sidebar, go to **APIs & Services > Library**.
3. Search for **Google Calendar API** and click **Enable**.
4. Go to **APIs & Services > OAuth consent screen**.
   - Choose **External** user type.
   - Fill in the app name (e.g. "DeskDisplay"), your email, and developer contact.
   - Add the scope: `https://www.googleapis.com/auth/calendar.readonly`
   - Add your email as a test user.
5. Go to **APIs & Services > Credentials**.
   - Click **Create Credentials > OAuth 2.0 Client ID**.
   - Application type: **Web application**.
   - Add **Authorised redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (for local dev)
     - `https://your-production-domain.vercel.app/api/auth/callback/google` (for production)
   - Copy the **Client ID** and **Client Secret** — you'll need these.

---

## Local Development Setup

1. Clone or download this repository:
   ```bash
   git clone <repo-url>
   cd desk-display
   ```

2. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Fill in `.env.local` with your values:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
   GOOGLE_CLIENT_ID=<from Google Cloud Console>
   GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
   KV_URL=<from Vercel KV — see below>
   KV_REST_API_URL=<from Vercel KV>
   KV_REST_API_TOKEN=<from Vercel KV>
   KV_REST_API_READ_ONLY_TOKEN=<from Vercel KV>
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000/display](http://localhost:3000/display) for the ambient display, or [http://localhost:3000/admin](http://localhost:3000/admin) to configure settings.

---

## Vercel KV Setup

DeskDisplay uses Vercel KV (Redis) to persist display settings across deployments.

1. Log in to [vercel.com](https://vercel.com) and open your project dashboard (or create one first by importing from GitHub).
2. Go to the **Storage** tab in your project.
3. Click **Create Database** and choose **KV (Redis)**.
4. Give it a name (e.g. `desk-display-kv`) and click **Create**.
5. Vercel will automatically add the KV environment variables to your project.
6. To use locally, go to the **KV** store settings and copy the environment variables, then paste them into your `.env.local` file.

The app stores display settings under the key `display_settings`. If KV is unavailable, it falls back to built-in defaults so the display still works.

---

## Deployment

1. Push your project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
3. During setup, add all environment variables from `.env.local.example`:
   - `NEXTAUTH_URL` — set to your production URL (e.g. `https://desk-display.vercel.app`)
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - KV variables — these are added automatically if you set up Vercel KV in step above
4. Click **Deploy**.
5. Once deployed, update your Google Cloud Console OAuth redirect URI to include your production domain.

---

## Usage

| URL | Purpose |
|-----|---------|
| `/display` | Open this in a browser on your desk screen (fullscreen with F11) |
| `/admin` | Sign in with Google to configure settings |
| `/admin/login` | Manual sign-in page |

### Tips

- Point a Raspberry Pi browser at `/display` for a dedicated desk display
- Set your browser to kiosk/fullscreen mode for a clean look
- The display auto-scales to fit any screen size while keeping the 16:9 ratio
- Weather updates every 10 minutes; calendar events refresh every 2 minutes
- The green pulse animation fires when a calendar event starts within 1 minute (fires once per event per day)
