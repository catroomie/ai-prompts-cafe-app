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
    <div className="card p-3.5">
      <div className="text-xs text-(--subtext)">{label}</div>
      <div
        className={`mt-1 text-2xl font-semibold ${
          emphasis ? "text-(--danger)" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
