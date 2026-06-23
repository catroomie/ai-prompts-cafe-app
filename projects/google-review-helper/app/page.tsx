"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { analyzeImprovements, isThisMonth } from "@/lib/improvementAnalyzer";
import { getReviews, getStore } from "@/lib/storage";
import { Review, Store } from "@/lib/types";

export default function DashboardPage() {
  const [store, setStore] = useState<Store | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setStore(getStore());
    setReviews(getReviews());
  }, []);

  if (!store) return null;

  const reviewCount = reviews.length;
  const avgRating = reviewCount
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : "-";
  const unrepliedCount = reviews.filter((r) => !r.replied).length;
  const lowRatingCount = reviews.filter((r) => r.rating <= 2).length;

  const thisMonthReviews = reviews.filter((r) =>
    isThisMonth(r.postedAt, new Date())
  );
  const topImprovement = analyzeImprovements(thisMonthReviews)[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">{store.name}</h1>
        <p className="text-sm text-(--subtext)">口コミ対応アシスト ダッシュボード</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="評価" value={`★ ${avgRating}`} />
        <StatCard label="口コミ件数" value={`${reviewCount}件`} />
        <StatCard
          label="未返信口コミ"
          value={`${unrepliedCount}件`}
          emphasis={unrepliedCount > 0}
        />
        <StatCard
          label="低評価口コミ"
          value={`${lowRatingCount}件`}
          emphasis={lowRatingCount > 0}
        />
      </div>

      <div className="card p-4 space-y-2">
        <h2 className="text-sm font-medium">今月の改善ポイント</h2>
        {topImprovement ? (
          <p className="text-sm leading-relaxed text-(--subtext)">
            {topImprovement.suggestion}
          </p>
        ) : (
          <p className="text-sm text-(--subtext)">
            今月はまだ目立った傾向がありません。口コミが増えると改善ポイントが見えてきます。
          </p>
        )}
        <Link
          href="/improvements"
          className="tap-target inline-flex items-center text-sm text-(--accent)"
        >
          改善提案をすべて見る →
        </Link>
      </div>

      <Link
        href="/reviews"
        className="tap-target flex w-full items-center justify-center rounded-xl bg-(--accent) text-white text-sm font-medium active:scale-[0.99] transition"
      >
        口コミ対応が楽になる - 口コミを見る
      </Link>
    </div>
  );
}
