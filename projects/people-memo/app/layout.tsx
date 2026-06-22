import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "大切な人メモ",
  description: "友人・家族・仕事相手など、大切な人のことを忘れないためのメモアプリ",
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
