"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "ダッシュボード", icon: "🏠" },
  { href: "/reviews", label: "口コミ", icon: "💬" },
  { href: "/improvements", label: "改善提案", icon: "📈" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-(--border) bg-(--card-bg)/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tap-target flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs tracking-wide transition ${
                active ? "text-(--accent)" : "text-(--subtext)"
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
