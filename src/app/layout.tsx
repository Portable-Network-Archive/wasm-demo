import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "PNA Demo — Portable Network Archive in Your Browser",
  description:
    "Create and extract PNA archives directly in your browser using WebAssembly. No uploads, no server — everything runs locally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" type="image/svg+xml" href="favicon.svg" />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
