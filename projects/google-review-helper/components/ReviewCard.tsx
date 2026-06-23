"use client";

import { useState } from "react";
import { generateReply } from "@/lib/replyGenerator";
import { saveReview } from "@/lib/storage";
import { Review, TONE_LABELS, Tone, TONES } from "@/lib/types";
import Stars from "./Stars";

export default function ReviewCard({
  review,
  onSaved,
}: {
  review: Review;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<Tone>("polite");
  const [draft, setDraft] = useState(() => generateReply(review, "polite"));
  const [copied, setCopied] = useState(false);

  function handleOpen() {
    setOpen(true);
    setDraft(generateReply(review, tone));
  }

  function handleToneChange(next: Tone) {
    setTone(next);
    setDraft(generateReply(review, next));
    setCopied(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleMarkReplied() {
    saveReview({ ...review, replied: true, replyText: draft });
    setOpen(false);
    onSaved();
  }

  return (
    <div className="card p-4 space-y-2.5 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <Stars rating={review.rating} />
          <div className="text-(--subtext)">
            {review.reviewerName} ・ {review.postedAt}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
            review.replied
              ? "bg-(--tag-bg) text-(--subtext)"
              : "bg-(--danger-bg) text-(--danger)"
          }`}
        >
          {review.replied ? "返信済み" : "未返信"}
        </span>
      </div>

      <p className="leading-relaxed">{review.text}</p>

      {review.replied && review.replyText && !open && (
        <div className="rounded-lg bg-(--tag-bg) p-3 text-xs text-(--subtext)">
          返信内容：{review.replyText}
        </div>
      )}

      {!open && (
        <button
          onClick={handleOpen}
          className="tap-target w-full rounded-xl border border-dashed border-(--border) text-sm text-(--accent) active:border-(--accent) transition"
        >
          返信案を作成
        </button>
      )}

      {open && (
        <div className="space-y-2.5 rounded-xl border border-(--border) p-3 bg-(--bg)">
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => handleToneChange(t)}
                className={`tap-target flex-1 rounded-lg border text-xs transition ${
                  tone === t
                    ? "border-(--accent) bg-(--accent) text-white"
                    : "border-(--border) text-(--subtext)"
                }`}
              >
                {TONE_LABELS[t]}
              </button>
            ))}
          </div>
          <textarea
            className="field-input"
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="tap-target flex-1 rounded-xl border border-(--border) text-sm transition"
            >
              {copied ? "コピーしました" : "コピー"}
            </button>
            <button
              onClick={handleMarkReplied}
              className="tap-target flex-1 rounded-xl bg-(--accent) text-white text-sm font-medium active:scale-[0.99] transition"
            >
              返信済みにする
            </button>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="tap-target w-full text-xs text-(--subtext)"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
}
