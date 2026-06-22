import Link from "next/link";
import { Highlight } from "@/lib/highlights";

const REASON_LABEL: Record<Highlight["reason"], string> = {
  birthdaySoon: "🎂 誕生日が近い",
  notMetRecently: "👋 最近会ってない",
  pendingTopic: "💬 次に聞きたいこと",
};

export default function TodayHighlights({
  highlights,
}: {
  highlights: Highlight[];
}) {
  if (highlights.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-(--subtext)">今日見るべき人</h2>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
        {highlights.slice(0, 8).map((h, idx) => (
          <Link
            key={`${h.person.id}-${h.reason}-${idx}`}
            href={`/people/${h.person.id}`}
            className="tap-target shrink-0 w-48 rounded-xl border border-(--border) bg-(--card-bg) p-3 active:scale-[0.99] transition shadow-(--shadow)"
          >
            <span className="text-xs text-(--accent) font-medium">
              {REASON_LABEL[h.reason]}
            </span>
            <p className="font-medium mt-1 truncate">{h.person.name}</p>
            <p className="text-xs text-(--subtext) mt-0.5 truncate">
              {h.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
