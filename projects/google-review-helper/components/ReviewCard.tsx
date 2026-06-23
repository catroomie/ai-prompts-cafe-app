"use client";

import { useState } from "react";
import { Check, Copy, PenLine } from "lucide-react";
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

  const isLowRating = review.rating <= 2;
  const needsAction = !review.replied;
  const accentBar = isLowRating ? "var(--danger)" : "var(--accent)";

  return (
    <div
      className="card p-4 space-y-3 text-sm overflow-hidden"
      style={
        needsAction
          ? { borderLeft: `3px solid ${accentBar}` }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5">
          <Stars rating={review.rating} />
          <div className="text-xs text-(--subtext)">
            {review.reviewerName}　{review.postedAt}
          </div>
        </div>
        <span
          className={`pill shrink-0 ${
            review.replied
              ? "border-(--border) bg-(--tag-bg) text-(--subtext)"
              : "border-transparent bg-(--danger) text-white"
          }`}
        >
          {review.replied ? "返信済み" : "未対応"}
        </span>
      </div>

      <p className="leading-relaxed text-(--text)">{review.text}</p>

      {review.replied && review.replyText && !open && (
        <div className="rounded-lg border border-(--border) bg-(--tag-bg) p-3 text-xs leading-relaxed text-(--subtext)">
          <span className="font-medium text-(--text)">返信内容</span>
          <br />
          {review.replyText}
        </div>
      )}

      {!open && (
        <button onClick={handleOpen} className="btn-soft w-full gap-1.5">
          <PenLine size={15} />
          すぐに返信文を作成
        </button>
      )}

      {open && (
        <div className="space-y-2.5 rounded-lg border border-(--border) bg-(--bg) p-3">
          <p className="text-xs font-medium text-(--subtext)">返信の文体を選ぶ</p>
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => handleToneChange(t)}
                className={`tap-target flex-1 rounded-lg border text-xs font-medium transition ${
                  tone === t
                    ? "border-(--accent) bg-(--accent) text-white"
                    : "border-(--border-strong) text-(--subtext)"
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
            <button onClick={handleCopy} className="btn-outline flex-1 gap-1.5">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "コピーしました" : "コピー"}
            </button>
            <button onClick={handleMarkReplied} className="btn-primary flex-1">
              対応完了にする
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
