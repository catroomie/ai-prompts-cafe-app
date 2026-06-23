export default function StatCard({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="card p-4">
      <div className="text-xs tracking-wide text-(--subtext)">{label}</div>
      <div
        className={`mt-1.5 text-2xl font-display ${
          emphasis ? "text-(--danger)" : "text-(--text)"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
