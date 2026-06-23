"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquareText, TriangleAlert } from "lucide-react";

const TABS = [
  { href: "/", label: "ホーム", Icon: LayoutDashboard },
  { href: "/reviews", label: "口コミ", Icon: MessageSquareText },
  { href: "/improvements", label: "失客リスク", Icon: TriangleAlert },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-(--border) bg-(--card-bg)/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`tap-target flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs tracking-wide transition ${
                active ? "text-(--accent)" : "text-(--subtext)"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
