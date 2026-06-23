"use client";

import { useState } from "react";
import { generateSnsPost } from "@/lib/snsGenerator";
import { ImprovementSuggestion } from "@/lib/types";

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
    <div className="card p-4 space-y-2.5 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-(--tag-bg) px-2.5 py-1 text-xs text-(--subtext)">
          「{suggestion.keyword}」に関する声 {suggestion.count}件
        </span>
      </div>
      <p className="leading-relaxed">{suggestion.suggestion}</p>

      {!open && (
        <button
          onClick={handleOpen}
          className="tap-target w-full rounded-xl border border-dashed border-(--border) text-sm text-(--accent) active:border-(--accent) transition"
        >
          SNS投稿文を作成
        </button>
      )}

      {open && (
        <div className="space-y-2.5 rounded-xl border border-(--border) p-3 bg-(--bg)">
          <textarea
            className="field-input whitespace-pre-wrap"
            rows={7}
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="tap-target flex-1 rounded-xl bg-(--accent) text-white text-sm font-medium active:scale-[0.99] transition"
            >
              {copied ? "コピーしました" : "コピー"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="tap-target rounded-xl border border-(--border) px-4 text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
