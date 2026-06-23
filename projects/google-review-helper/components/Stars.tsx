import { Star } from "lucide-react";
import { Rating } from "@/lib/types";

export default function Stars({ rating }: { rating: Rating }) {
  const color = rating <= 2 ? "var(--danger)" : "var(--accent)";
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`評価 ${rating}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={15}
          color={color}
          fill={i < rating ? color : "transparent"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
