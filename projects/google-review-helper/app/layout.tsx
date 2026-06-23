import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

const notoSerifJP = Noto_Serif_JP({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
});

export const metadata: Metadata = {
  title: "口コミ管理システム",
  description:
    "口コミへの返信時間を短縮し、失客リスクを見える化する店舗向け管理システム",
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
    title: "口コミ管理",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#bd6f56",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJP.variable} ${notoSerifJP.variable}`}
    >
      <body>
        <div className="min-h-screen max-w-2xl mx-auto px-4 pt-6 pb-24">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
