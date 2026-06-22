"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PersonCard from "@/components/PersonCard";
import TodayHighlights from "@/components/TodayHighlights";
import { daysSince, daysUntilBirthday } from "@/lib/date";
import { getTodayHighlights } from "@/lib/highlights";
import { getLatestInteractionMap, getPeople } from "@/lib/storage";
import { Interaction, Person, RELATIONSHIPS, Relationship } from "@/lib/types";

type SortOption = "new" | "recentlyMet" | "birthdaySoon";

const SORT_LABEL: Record<SortOption, string> = {
  new: "新着順",
  recentlyMet: "最近会った順",
  birthdaySoon: "誕生日が近い順",
};

export default function PeopleList() {
  const [people, setPeople] = useState<Person[]>([]);
  const [latestByPerson, setLatestByPerson] = useState<
    Record<string, Interaction>
  >({});
  const [query, setQuery] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState<
    Relationship | "すべて"
  >("すべて");
  const [sort, setSort] = useState<SortOption>("new");

  useEffect(() => {
    setPeople(getPeople());
    setLatestByPerson(getLatestInteractionMap());
  }, []);

  const highlights = useMemo(
    () => getTodayHighlights(people, latestByPerson),
    [people, latestByPerson]
  );

  const filtered = useMemo(() => {
    let result = people.filter((p) => {
      const matchesQuery =
        !query ||
        [p.name, p.favoriteFood, p.favoritePlace, p.notes]
          .filter(Boolean)
          .some((v) => v!.includes(query));
      const matchesRelationship =
        relationshipFilter === "すべて" || p.relationship === relationshipFilter;
      return matchesQuery && matchesRelationship;
    });

    result = [...result].sort((a, b) => {
      if (sort === "recentlyMet") {
        const aDate = latestByPerson[a.id]?.date;
        const bDate = latestByPerson[b.id]?.date;
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return daysSince(aDate) - daysSince(bDate);
      }
      if (sort === "birthdaySoon") {
        const aDays = a.birthday ? daysUntilBirthday(a.birthday) : null;
        const bDays = b.birthday ? daysUntilBirthday(b.birthday) : null;
        if (aDays === null && bDays === null) return 0;
        if (aDays === null) return 1;
        if (bDays === null) return -1;
        return aDays - bDays;
      }
      return a.updatedAt < b.updatedAt ? 1 : -1;
    });

    return result;
  }, [people, query, relationshipFilter, sort, latestByPerson]);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">大切な人メモ</h1>

      <TodayHighlights highlights={highlights} />

      <input
        className="field-input tap-target"
        placeholder="名前・好きなもの・メモで検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {(["すべて", ...RELATIONSHIPS] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRelationshipFilter(r)}
            className={`tap-target shrink-0 rounded-full px-3.5 text-sm border transition ${
              relationshipFilter === r
                ? "bg-(--accent) text-white border-(--accent)"
                : "bg-(--card-bg) border-(--border) text-(--subtext)"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-(--subtext)">{filtered.length}人</span>
        <select
          className="field-input tap-target w-auto py-2 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          {(Object.keys(SORT_LABEL) as SortOption[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABEL[key]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-(--subtext) text-center py-12">
          {people.length === 0
            ? "まだ誰も登録されていません。右下の + から始めましょう。"
            : "該当する人がいません。"}
        </p>
      )}

      <div className="space-y-2.5">
        {filtered.map((p) => (
          <PersonCard
            key={p.id}
            person={p}
            latestInteraction={latestByPerson[p.id]}
          />
        ))}
      </div>

      <Link
        href="/people/new"
        aria-label="新しい人を追加"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-(--accent) text-white text-2xl leading-none flex items-center justify-center shadow-(--shadow-hover) active:scale-95 transition"
      >
        +
      </Link>
    </div>
  );
}
