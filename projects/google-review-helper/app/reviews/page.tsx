"use client";

import { useEffect, useState } from "react";
import ReviewCard from "@/components/ReviewCard";
import { getReviews } from "@/lib/storage";
import { Review } from "@/lib/types";

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

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs tracking-[0.2em] text-(--accent)">REVIEWS</p>
        <h1 className="text-2xl font-medium">口コミ一覧</h1>
        <p className="text-sm text-(--subtext)">
          対応が必要な口コミを優先表示。素早く返信して失客を防ぎます。
        </p>
      </div>

      <div className="space-y-3">
        {sorted.map((review) => (
          <ReviewCard key={review.id} review={review} onSaved={reload} />
        ))}
      </div>
    </div>
  );
}
