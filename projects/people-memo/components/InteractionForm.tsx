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
        className="w-full rounded-lg border border-dashed border-(--border) py-2.5 text-sm text-(--subtext) hover:border-(--accent) hover:text-(--accent) transition"
      >
        + 会った記録を追加
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-(--border) p-4 bg-(--card-bg)"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">会った日</label>
          <input
            type="date"
            className="w-full rounded-lg border px-2 py-1.5 text-sm bg-(--card-bg) border-(--border)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">場所</label>
          <input
            className="w-full rounded-lg border px-2 py-1.5 text-sm bg-(--card-bg) border-(--border)"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="例: カフェ"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">話した内容</label>
        <textarea
          className="w-full rounded-lg border px-2 py-1.5 text-sm bg-(--card-bg) border-(--border)"
          rows={2}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">
          次回話したいこと
        </label>
        <input
          className="w-full rounded-lg border px-2 py-1.5 text-sm bg-(--card-bg) border-(--border)"
          value={nextTopic}
          onChange={(e) => setNextTopic(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">
          渡したもの・もらったもの
        </label>
        <input
          className="w-full rounded-lg border px-2 py-1.5 text-sm bg-(--card-bg) border-(--border)"
          value={gift}
          onChange={(e) => setGift(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-(--accent) text-white py-2 text-sm font-medium hover:bg-(--accent-hover) transition"
        >
          記録する
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-(--border) px-4 py-2 text-sm"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
