import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

const basePath = process.env.BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "PNA Demo — Portable Network Archive in Your Browser",
  description:
    "Create and extract PNA archives directly in your browser using WebAssembly. No uploads, no server — everything runs locally.",
  icons: {
    icon: [{ url: `${basePath}/favicon.svg`, type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
