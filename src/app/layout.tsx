import { VercelToolbar } from "@vercel/toolbar/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import "@/styles/globals.css";
import { RegistrySidebar } from "@/app/registry-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
    default: "The cost-of-living squeeze | thecolab.ai",
    template: "%s | thecolab.ai",
  },
  description:
    "NZ cost-of-living & child-poverty tools — real Stats NZ, MBIE, MSD and University of Otago data brought together by AI. A thecolab.ai Impact for Good experiment.",
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
            {/* Mobile top bar — the sidebar is a hidden sheet on small screens,
                so this provides the trigger to open it. Hidden on md+ where the
                sidebar is always visible. */}
            <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden print:hidden">
              <SidebarTrigger className="-ml-1" />
              <Link href="/" className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-brand-navy">
                  thecolab<span className="text-brand-cyan">.ai</span>
                </span>
              </Link>
            </header>
            <div className="flex min-h-screen flex-col">{children}</div>
          </SidebarInset>
        </SidebarProvider>

        {process.env.NODE_ENV === "development" && <VercelToolbar />}
      </body>
    </html>
  );
}
