"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPeople } from "@/lib/storage";
import { Person } from "@/lib/types";

export default function PeopleList() {
  const [people, setPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setPeople(getPeople());
  }, []);

  const filtered = people.filter(
    (p) =>
      p.name.includes(query) ||
      p.likes?.includes(query) ||
      p.notes?.includes(query)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">大切な人メモ</h1>
        <Link
          href="/people/new"
          className="rounded-lg bg-(--accent) text-white text-sm px-4 py-2 font-medium hover:bg-(--accent-hover) transition"
        >
          + 追加
        </Link>
      </div>

      <input
        className="w-full rounded-lg border px-3 py-2 bg-(--card-bg) border-(--border)"
        placeholder="名前・好きなもの・メモで検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.length === 0 && (
        <p className="text-sm text-(--subtext) text-center py-12">
          {people.length === 0
            ? "まだ誰も登録されていません。「+ 追加」から始めましょう。"
            : "該当する人がいません。"}
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/people/${p.id}`}
            className="block rounded-lg border border-(--border) bg-(--card-bg) p-4 hover:shadow-(--shadow-hover) transition"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{p.name}</span>
              <span className="text-xs rounded-full bg-(--tag-bg) px-2 py-1 text-(--subtext)">
                {p.relationship}
              </span>
            </div>
            {p.likes && (
              <p className="text-sm text-(--subtext) mt-1">{p.likes}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
