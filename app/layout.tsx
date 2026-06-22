import type { Metadata } from "next";
import { Concert_One, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const concertOne = Concert_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-concert-one",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DeskDisplay",
  description: "Ambient desk display",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${concertOne.variable} ${spaceGrotesk.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
