import { VercelToolbar } from "@vercel/toolbar/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

import "@/styles/globals.css";
import { RegistrySidebar } from "@/app/registry-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Template | thecolab.ai",
    template: "%s | thecolab.ai",
  },
  description:
    "AI expertise, built together — a starter template by thecolab.ai, New Zealand's community-driven AI consultancy.",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">
        <SidebarProvider>
          <RegistrySidebar />
          <SidebarInset>
            <div className="flex min-h-screen flex-col">{children}</div>
          </SidebarInset>
        </SidebarProvider>

        {process.env.NODE_ENV === "development" && <VercelToolbar />}
      </body>
    </html>
  );
}
