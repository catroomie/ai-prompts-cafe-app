import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "口コミ対応アシスト",
  description: "Googleマップの口コミ対応・改善提案を一目で確認できるデモアプリ",
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
    title: "口コミアシスト",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#e07a3f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen max-w-2xl mx-auto px-4 pt-6 pb-24">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
