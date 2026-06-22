"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { savePerson } from "@/lib/storage";
import {
  BLOOD_TYPES,
  BloodType,
  MBTI,
  MBTI_TYPES,
  Person,
  RELATIONSHIPS,
  Relationship,
} from "@/lib/types";

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
  const [mbti, setMbti] = useState<MBTI | "">(existing?.mbti ?? "");
  const [bloodType, setBloodType] = useState<BloodType | "">(
    existing?.bloodType ?? ""
  );
  const [favoriteFood, setFavoriteFood] = useState(
    existing?.favoriteFood ?? ""
  );
  const [favoritePlace, setFavoritePlace] = useState(
    existing?.favoritePlace ?? ""
  );
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
      mbti: mbti || undefined,
      bloodType: bloodType || undefined,
      favoriteFood: favoriteFood.trim() || undefined,
      favoritePlace: favoritePlace.trim() || undefined,
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
        <label className="field-label">名前 *</label>
        <input
          className="field-input tap-target"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="例: 田中さん"
        />
      </div>

      <div>
        <label className="field-label">関係</label>
        <select
          className="field-input tap-target"
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">誕生日（MM-DD）</label>
          <input
            className="field-input tap-target"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            placeholder="例: 04-15"
          />
        </div>
        <div>
          <label className="field-label">最寄り駅</label>
          <input
            className="field-input tap-target"
            value={nearestStation}
            onChange={(e) => setNearestStation(e.target.value)}
            placeholder="例: 渋谷駅"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">MBTI</label>
          <select
            className="field-input tap-target"
            value={mbti}
            onChange={(e) => setMbti(e.target.value as MBTI | "")}
          >
            <option value="">未設定</option>
            {MBTI_TYPES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">血液型</label>
          <select
            className="field-input tap-target"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value as BloodType | "")}
          >
            <option value="">未設定</option>
            {BLOOD_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}型
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label">好きな食べ物</label>
        <input
          className="field-input tap-target"
          value={favoriteFood}
          onChange={(e) => setFavoriteFood(e.target.value)}
          placeholder="例: 韓国料理、辛いもの"
        />
      </div>

      <div>
        <label className="field-label">好きな場所</label>
        <input
          className="field-input tap-target"
          value={favoritePlace}
          onChange={(e) => setFavoritePlace(e.target.value)}
          placeholder="例: カフェ、海"
        />
      </div>

      <div>
        <label className="field-label">メモ</label>
        <textarea
          className="field-input"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="アレルギー、共通の知人、覚えておきたいことなど"
        />
      </div>

      <button
        type="submit"
        className="tap-target w-full rounded-xl bg-(--accent) text-white py-3 font-medium active:scale-[0.99] transition"
      >
        保存する
      </button>
    </form>
  );
}
