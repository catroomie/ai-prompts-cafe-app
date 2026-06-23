"use client";

import { useEffect, useState } from "react";
import ImprovementCard from "@/components/ImprovementCard";
import { TriangleAlert } from "lucide-react";
import { analyzeImprovements } from "@/lib/improvementAnalyzer";
import { getReviews, getStore } from "@/lib/storage";
import { ImprovementSuggestion, Review, Store } from "@/lib/types";

export default function ImprovementsPage() {
  const [store, setStore] = useState<Store | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setStore(getStore());
    setReviews(getReviews());
  }, []);

  if (!store) return null;

  const suggestions: ImprovementSuggestion[] = analyzeImprovements(reviews);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <TriangleAlert size={20} className="text-(--danger)" />
          失客リスク
        </h1>
        <p className="text-sm text-(--subtext)">
          口コミに多い不満です。お客様が離れる前に対策しましょう。
        </p>
      </div>

      {suggestions.length === 0 && (
        <p className="text-sm text-(--subtext)">
          まだ目立ったリスクはありません。口コミが増えるとここに表示されます。
        </p>
      )}

      <div className="space-y-3">
        {suggestions.map((s) => (
          <ImprovementCard key={s.keyword} suggestion={s} storeName={store.name} />
        ))}
      </div>
    </div>
  );
}
