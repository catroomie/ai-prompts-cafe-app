"use client";

import { useState } from "react";
import { Check, Copy, Megaphone, TriangleAlert } from "lucide-react";
import { actionLabel, estimateOpportunityLoss } from "@/lib/improvementAnalyzer";
import { generateSnsPost } from "@/lib/snsGenerator";
import { ImprovementSuggestion } from "@/lib/types";

type Level = "high" | "mid" | "low";

function severity(count: number): { label: string; level: Level } {
  if (count >= 4) return { label: "リスク高", level: "high" };
  if (count >= 2) return { label: "リスク中", level: "mid" };
  return { label: "リスク低", level: "low" };
}

const LEVEL_PILL: Record<Level, string> = {
  high: "border-(--danger) bg-(--danger-bg) text-(--danger)",
  mid: "border-(--warn) bg-(--warn-bg) text-(--warn)",
  low: "border-(--border) bg-(--tag-bg) text-(--subtext)",
};

export default function ImprovementCard({
  suggestion,
  storeName,
}: {
  suggestion: ImprovementSuggestion;
  storeName: string;
}) {
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState("");
  const [copied, setCopied] = useState(false);
  const { label, level } = severity(suggestion.count);
  const loss = estimateOpportunityLoss(suggestion.count);

  function handleOpen() {
    setPost(generateSnsPost(suggestion, storeName));
    setOpen(true);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="card p-4 space-y-3 text-sm"
      style={
        level === "high"
          ? { borderLeft: "3px solid var(--danger)" }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-(--text)">
          「{suggestion.keyword}」への声
          <span className="ml-1.5 text-(--subtext)">{suggestion.count}件</span>
        </span>
        <span className={`pill shrink-0 ${LEVEL_PILL[level]}`}>
          <TriangleAlert size={12} />
          {label}
        </span>
      </div>
      <p className="leading-relaxed text-(--subtext)">{suggestion.suggestion}</p>

      <div className="flex items-center gap-5 rounded-lg bg-(--bg) px-3 py-2.5">
        <div>
          <p className="text-[11px] text-(--subtext)">予約機会損失推定</p>
          <p className="font-display text-lg text-(--text)">
            {loss.min}〜{loss.max}件
          </p>
        </div>
        <div>
          <p className="text-[11px] text-(--subtext)">推奨アクション</p>
          <p className="text-sm font-semibold text-(--text)">
            {actionLabel(suggestion.keyword)}
          </p>
        </div>
      </div>

      {!open && (
        <div className="space-y-2">
          <p className="text-xs text-(--subtext)">
            予約につながるお知らせ文をその場で作成できます
          </p>
          <button onClick={handleOpen} className="btn-outline w-full gap-1.5">
            <Megaphone size={15} />
            SNS投稿文を作成
          </button>
        </div>
      )}

      {open && (
        <div className="space-y-2.5 rounded-lg border border-(--border) bg-(--bg) p-3">
          <textarea
            className="field-input whitespace-pre-wrap"
            rows={7}
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-primary flex-1 gap-1.5">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "コピーしました" : "コピー"}
            </button>
            <button onClick={() => setOpen(false)} className="btn-outline px-4">
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
