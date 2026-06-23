import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "大切な人メモ",
  description: "友人・家族・仕事相手など、大切な人のことを忘れないためのメモアプリ",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "人メモ",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#5b8a72",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen max-w-2xl mx-auto px-4 pt-6 pb-28">
          {children}
        </div>
      </body>
    </html>
  );
}
