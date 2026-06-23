"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Clock,
  MessageSquareText,
  Star,
  TrendingDown,
} from "lucide-react";
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
  const hasRisk = unrepliedCount > 0 || lowRatingCount > 0;

  const thisMonthReviews = reviews.filter((r) =>
    isThisMonth(r.postedAt, new Date())
  );
  const topImprovement = analyzeImprovements(thisMonthReviews)[0];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs tracking-[0.2em] text-(--accent)">SALON MANAGEMENT</p>
        <h1 className="text-2xl font-medium">{store.name}</h1>
        <p className="text-sm text-(--subtext)">口コミ管理システム</p>
      </div>

      {hasRisk && (
        <div className="card border-(--danger) bg-(--danger-bg) p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-(--danger)" />
          <div className="space-y-1">
            <div className="text-sm font-semibold text-(--danger)">
              失客リスクアラート
            </div>
            <p className="text-sm leading-relaxed text-(--text)">
              未対応の口コミが{unrepliedCount}件あります。対応が遅れるほど顧客が離れる失客リスクが高まります。
            </p>
            <Link
              href="/reviews"
              className="inline-flex items-center text-sm font-medium text-(--danger)"
            >
              今すぐ対応する →
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="評価" value={`★ ${avgRating}`} icon={Star} />
        <StatCard
          label="口コミ件数"
          value={`${reviewCount}件`}
          icon={MessageSquareText}
        />
        <StatCard
          label="未対応口コミ"
          value={`${unrepliedCount}件`}
          icon={Clock}
          emphasis={unrepliedCount > 0}
        />
        <StatCard
          label="低評価口コミ"
          value={`${lowRatingCount}件`}
          icon={AlertTriangle}
          emphasis={lowRatingCount > 0}
        />
      </div>

      <div className="card p-5 space-y-2">
        <div className="flex items-center gap-2 text-(--accent)">
          <TrendingDown size={16} />
          <h2 className="text-sm tracking-wide">今月の失客リスク</h2>
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
          className="tap-target inline-flex items-center text-sm text-(--accent)"
        >
          失客リスクの詳細を見る →
        </Link>
      </div>

      <Link href="/reviews" className="btn-primary w-full gap-2">
        <Clock size={16} />
        対応時間を短縮 - 未対応の口コミを確認
      </Link>
    </div>
  );
}
