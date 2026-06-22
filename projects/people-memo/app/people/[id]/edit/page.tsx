"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PersonForm from "@/components/PersonForm";
import { getPerson } from "@/lib/storage";
import { Person } from "@/lib/types";

export default function EditPersonPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null | undefined>(undefined);

  useEffect(() => {
    setPerson(getPerson(id) ?? null);
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

  return (
    <div className="space-y-4">
      <Link href={`/people/${id}`} className="text-sm text-(--subtext)">
        ← 戻る
      </Link>
      <h1 className="text-xl font-semibold">編集</h1>
      <PersonForm existing={person} />
    </div>
  );
}
