"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Clock,
  MessageSquareText,
  Scissors,
  Star,
  TriangleAlert,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { analyzeImprovements, isThisMonth } from "@/lib/improvementAnalyzer";
import { getReviews, getStore } from "@/lib/storage";
import { Review, Store } from "@/lib/types";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function formatToday(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${
    WEEKDAYS[d.getDay()]
  }）`;
}

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
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs text-(--subtext)">{formatToday(new Date())}</p>
          <h1 className="font-display text-2xl text-(--text)">{store.name}</h1>
        </div>
        <div className="flex size-11 items-center justify-center rounded-xl bg-(--accent-soft) text-(--accent)">
          <Scissors size={20} />
        </div>
      </div>

      {unrepliedCount > 0 && (
        <Link
          href="/reviews"
          className="card flex items-center gap-3 border-(--danger) bg-(--danger-bg) p-4 active:scale-[0.99] transition"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--danger) text-white">
            <Clock size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-(--danger)">
              未対応の口コミが{unrepliedCount}件あります
            </p>
            <p className="text-xs text-(--text)">
              返信が早いほど、お客様の評価につながります
            </p>
          </div>
          <ChevronRight size={20} className="ml-auto shrink-0 text-(--danger)" />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="未対応の口コミ"
          value={`${unrepliedCount}件`}
          icon={Clock}
          emphasis={unrepliedCount > 0}
        />
        <StatCard
          label="低評価の口コミ"
          value={`${lowRatingCount}件`}
          icon={TriangleAlert}
          emphasis={lowRatingCount > 0}
        />
        <StatCard label="平均評価" value={`★ ${avgRating}`} icon={Star} />
        <StatCard
          label="口コミ総数"
          value={`${reviewCount}件`}
          icon={MessageSquareText}
        />
      </div>

      <div className="card p-5 space-y-2.5">
        <div className="flex items-center gap-2 text-(--text)">
          <TriangleAlert size={17} className="text-(--accent)" />
          <h2 className="text-sm font-semibold">今月の失客リスク</h2>
        </div>
        {topImprovement ? (
          <p className="text-sm leading-relaxed text-(--subtext)">
            {topImprovement.suggestion}
          </p>
        ) : (
          <p className="text-sm text-(--subtext)">
            今月はまだ目立ったリスクがありません。口コミが増えると傾向が見えてきます。
          </p>
        )}
        <Link
          href="/improvements"
          className="tap-target inline-flex items-center gap-0.5 text-sm font-medium text-(--accent)"
        >
          くわしく見る
          <ChevronRight size={16} />
        </Link>
      </div>

      <Link href="/reviews" className="btn-primary w-full gap-2">
        <MessageSquareText size={17} />
        対応時間を短縮 - 未対応の口コミを確認
      </Link>
    </div>
  );
}
