"use client";

import { useState } from "react";
import { saveInteraction } from "@/lib/storage";
import { Interaction } from "@/lib/types";

export default function InteractionForm({
  personId,
  onSaved,
}: {
  personId: string;
  onSaved: () => void;
}) {
  const [date, setDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [place, setPlace] = useState("");
  const [topic, setTopic] = useState("");
  const [nextTopic, setNextTopic] = useState("");
  const [gift, setGift] = useState("");
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const interaction: Interaction = {
      id: crypto.randomUUID(),
      personId,
      date,
      place: place.trim() || undefined,
      topic: topic.trim() || undefined,
      nextTopic: nextTopic.trim() || undefined,
      gift: gift.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    saveInteraction(interaction);
    setPlace("");
    setTopic("");
    setNextTopic("");
    setGift("");
    setOpen(false);
    onSaved();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="tap-target w-full rounded-xl border border-dashed border-(--border) py-3 text-sm text-(--subtext) active:border-(--accent) active:text-(--accent) transition"
      >
        + 会った記録を追加
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-(--border) p-4 bg-(--card-bg)"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">会った日</label>
          <input
            type="date"
            className="field-input tap-target"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">場所</label>
          <input
            className="field-input tap-target"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="例: カフェ"
          />
        </div>
      </div>
      <div>
        <label className="field-label">話した内容</label>
        <textarea
          className="field-input"
          rows={2}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label">次に聞きたいこと</label>
        <input
          className="field-input tap-target"
          value={nextTopic}
          onChange={(e) => setNextTopic(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label">プレゼント・差し入れ</label>
        <input
          className="field-input tap-target"
          value={gift}
          onChange={(e) => setGift(e.target.value)}
          placeholder="渡したもの・もらったもの"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="tap-target flex-1 rounded-xl bg-(--accent) text-white text-sm font-medium active:scale-[0.99] transition"
        >
          記録する
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="tap-target rounded-xl border border-(--border) px-4 text-sm"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
