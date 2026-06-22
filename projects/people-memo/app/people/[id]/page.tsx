"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InteractionForm from "@/components/InteractionForm";
import {
  deleteInteraction,
  deletePerson,
  getInteractions,
  getPerson,
} from "@/lib/storage";
import { Interaction, Person } from "@/lib/types";

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null | undefined>(undefined);
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  function reload() {
    setPerson(getPerson(id) ?? null);
    setInteractions(getInteractions(id));
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (person === undefined) return null;

  if (person === null) {
    return (
      <div className="space-y-4">
        <Link href="/" className="text-sm text-(--subtext)">
          ← 戻る
        </Link>
        <p>見つかりませんでした。</p>
      </div>
    );
  }

  function handleDeletePerson() {
    if (!confirm(`${person!.name}を削除しますか？`)) return;
    deletePerson(id);
    router.push("/");
  }

  return (
    <div className="space-y-5">
      <Link href="/" className="text-sm text-(--subtext)">
        ← 戻る
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{person.name}</h1>
          <span className="text-xs rounded-full bg-(--tag-bg) px-2 py-1 text-(--subtext)">
            {person.relationship}
          </span>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            href={`/people/${id}/edit`}
            className="text-(--accent) hover:underline"
          >
            編集
          </Link>
          <button
            onClick={handleDeletePerson}
            className="text-red-500 hover:underline"
          >
            削除
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-(--border) bg-(--card-bg) p-4 space-y-2 text-sm">
        {person.birthday && (
          <div>
            <span className="text-(--subtext)">誕生日：</span>
            {person.birthday}
          </div>
        )}
        {person.nearestStation && (
          <div>
            <span className="text-(--subtext)">最寄り駅：</span>
            {person.nearestStation}
          </div>
        )}
        {person.likes && (
          <div>
            <span className="text-(--subtext)">好きなもの：</span>
            {person.likes}
          </div>
        )}
        {person.notes && (
          <div>
            <span className="text-(--subtext)">メモ：</span>
            {person.notes}
          </div>
        )}
        {!person.birthday &&
          !person.nearestStation &&
          !person.likes &&
          !person.notes && (
            <p className="text-(--subtext)">登録された情報はまだありません。</p>
          )}
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">会った記録</h2>
        <InteractionForm personId={id} onSaved={reload} />

        <div className="space-y-2">
          {interactions.map((i) => (
            <div
              key={i.id}
              className="rounded-lg border border-(--border) bg-(--card-bg) p-3 text-sm space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{i.date}</span>
                <button
                  onClick={() => {
                    deleteInteraction(i.id);
                    reload();
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  削除
                </button>
              </div>
              {i.place && (
                <div>
                  <span className="text-(--subtext)">場所：</span>
                  {i.place}
                </div>
              )}
              {i.topic && (
                <div>
                  <span className="text-(--subtext)">話した内容：</span>
                  {i.topic}
                </div>
              )}
              {i.nextTopic && (
                <div>
                  <span className="text-(--subtext)">次回話したいこと：</span>
                  {i.nextTopic}
                </div>
              )}
              {i.gift && (
                <div>
                  <span className="text-(--subtext)">プレゼント：</span>
                  {i.gift}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
