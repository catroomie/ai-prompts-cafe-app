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
      <div>
        <h1 className="text-xl font-semibold">口コミ一覧</h1>
        <p className="text-sm text-(--subtext)">
          未返信・低評価の口コミを上に表示しています
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
