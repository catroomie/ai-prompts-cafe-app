"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { savePerson } from "@/lib/storage";
import { Person, RELATIONSHIPS, Relationship } from "@/lib/types";

export default function PersonForm({ existing }: { existing?: Person }) {
  const router = useRouter();
  const [name, setName] = useState(existing?.name ?? "");
  const [relationship, setRelationship] = useState<Relationship>(
    existing?.relationship ?? "友人"
  );
  const [birthday, setBirthday] = useState(existing?.birthday ?? "");
  const [nearestStation, setNearestStation] = useState(
    existing?.nearestStation ?? ""
  );
  const [likes, setLikes] = useState(existing?.likes ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const now = new Date().toISOString();
    const person: Person = {
      id: existing?.id ?? crypto.randomUUID(),
      name: name.trim(),
      relationship,
      birthday: birthday.trim() || undefined,
      nearestStation: nearestStation.trim() || undefined,
      likes: likes.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    savePerson(person);
    router.push(`/people/${person.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">名前 *</label>
        <input
          className="w-full rounded-lg border px-3 py-2 bg-(--card-bg) border-(--border)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="例: 田中さん"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">関係</label>
        <select
          className="w-full rounded-lg border px-3 py-2 bg-(--card-bg) border-(--border)"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value as Relationship)}
        >
          {RELATIONSHIPS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            誕生日（MM-DD）
          </label>
          <input
            className="w-full rounded-lg border px-3 py-2 bg-(--card-bg) border-(--border)"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            placeholder="例: 04-15"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">最寄り駅</label>
          <input
            className="w-full rounded-lg border px-3 py-2 bg-(--card-bg) border-(--border)"
            value={nearestStation}
            onChange={(e) => setNearestStation(e.target.value)}
            placeholder="例: 渋谷駅"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          好きなもの・趣味
        </label>
        <input
          className="w-full rounded-lg border px-3 py-2 bg-(--card-bg) border-(--border)"
          value={likes}
          onChange={(e) => setLikes(e.target.value)}
          placeholder="例: 韓国料理、猫、登山"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">メモ</label>
        <textarea
          className="w-full rounded-lg border px-3 py-2 bg-(--card-bg) border-(--border)"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="アレルギー、共通の知人、覚えておきたいことなど"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-(--accent) text-white py-2.5 font-medium hover:bg-(--accent-hover) transition"
      >
        保存する
      </button>
    </form>
  );
}
