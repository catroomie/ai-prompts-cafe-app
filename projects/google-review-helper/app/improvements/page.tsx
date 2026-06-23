"use client";

import { useEffect, useState } from "react";
import ImprovementCard from "@/components/ImprovementCard";
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
        <p className="text-xs tracking-[0.2em] text-(--accent)">IMPROVEMENTS</p>
        <h1 className="text-2xl font-medium">改善提案</h1>
        <p className="text-sm text-(--subtext)">
          口コミに多く登場する言葉から、改善のヒントをまとめました
        </p>
      </div>

      {suggestions.length === 0 && (
        <p className="text-sm text-(--subtext)">
          まだ目立った傾向はありません。口コミが増えるとここに改善ポイントが表示されます。
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
