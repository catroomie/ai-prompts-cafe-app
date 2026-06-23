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
    <div className="card p-4">
      <div className="flex items-center gap-1.5">
        <Icon size={15} strokeWidth={2.2} className="text-(--subtext)" />
        <span className="text-xs font-medium text-(--subtext)">{label}</span>
      </div>
      <div
        className={`mt-2 font-display text-3xl ${
          emphasis ? "text-(--danger)" : "text-(--text)"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
