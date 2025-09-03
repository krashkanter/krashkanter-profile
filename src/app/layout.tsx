import "~/styles/globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata } from "next";
// import { Schibsted_Grotesk } from "next/font/google";

export const metadata: Metadata = {
  title: "Keerthan K",
  description: "Portfolio?",
  icons: [{ rel: "icon", url: "/favicon.webp" }],
};

// const schibstedGrotesk = Schibsted_Grotesk({
//   subsets: ["latin"],
//   variable: "--font-schibsted-grotesk",
// });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={``}>
      <SpeedInsights />
      <body>
        {children}
      </body>
    </html>
  );
}
