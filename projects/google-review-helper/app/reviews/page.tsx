"use client";

import { useEffect, useState } from "react";
import ReviewCard from "@/components/ReviewCard";
import { getReviews } from "@/lib/storage";
import { Review } from "@/lib/types";

const MINUTES_PER_REPLY = 3;

function sortReviews(reviews: Review[]): Review[] {
  return [...reviews].sort((a, b) => {
    if (a.replied !== b.replied) return a.replied ? 1 : -1;
    if (a.rating !== b.rating) return a.rating - b.rating;
    return b.postedAt.localeCompare(a.postedAt);
  });
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  function reload() {
    setReviews(getReviews());
  }

  useEffect(() => {
    reload();
  }, []);

  const sorted = sortReviews(reviews);
  const unrepliedCount = reviews.filter((r) => !r.replied).length;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">口コミ一覧</h1>
        <p className="text-sm text-(--subtext)">
          未対応・低評価の口コミを上から順に表示しています
        </p>
      </div>

      {unrepliedCount > 0 && (
        <div className="card flex items-center justify-between gap-3 p-4">
          <div>
            <p className="text-xs font-medium text-(--subtext)">未返信口コミ</p>
            <p className="font-display text-2xl text-(--danger)">
              {unrepliedCount}件
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-(--subtext)">推定返信時間</p>
            <p className="font-display text-2xl text-(--text)">
              約{unrepliedCount * MINUTES_PER_REPLY}分
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((review) => (
          <ReviewCard key={review.id} review={review} onSaved={reload} />
        ))}
      </div>
    </div>
  );
}
