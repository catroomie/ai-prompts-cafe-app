import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  emphasis,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`card p-5 ${
        emphasis ? "border-(--danger) bg-(--danger-bg)" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          size={18}
          strokeWidth={2}
          className={emphasis ? "text-(--danger)" : "text-(--accent)"}
        />
        <div
          className={`text-xs tracking-wide ${
            emphasis ? "text-(--danger)" : "text-(--subtext)"
          }`}
        >
          {label}
        </div>
      </div>
      <div
        className={`mt-2 text-3xl font-display ${
          emphasis ? "text-(--danger)" : "text-(--text)"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
