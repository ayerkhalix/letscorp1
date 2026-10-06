import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";
import { WebMCP } from "@/components/webmcp";
import "./globals.css";
import "leaflet/dist/leaflet.css";
export const metadata: Metadata = {
  title: {
    default: "Let's Corp — Your local, all in one",
    template: "%s · Let's Corp",
  },
  description:
    "Discover businesses, island experiences, local promotions, conversations, and creativity in Puerto Princesa, Palawan.",
  icons: { icon: "/favicon.svg" },
  applicationName: "Let's Corp",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <WebMCP />
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
