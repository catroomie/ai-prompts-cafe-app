import { Rating } from "@/lib/types";

export default function Stars({ rating }: { rating: Rating }) {
  return (
    <span
      className={
        rating <= 2 ? "text-(--danger)" : "text-(--accent)"
      }
      aria-label={`評価 ${rating}`}
    >
      {"★".repeat(rating)}
      <span className="text-(--border)">{"★".repeat(5 - rating)}</span>
    </span>
  );
}
