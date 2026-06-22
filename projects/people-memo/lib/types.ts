export type Relationship = "友人" | "家族" | "仕事" | "知人" | "その他";

export const RELATIONSHIPS: Relationship[] = ["友人", "家族", "仕事", "知人", "その他"];

export type BloodType = "A" | "B" | "O" | "AB";

export const BLOOD_TYPES: BloodType[] = ["A", "B", "O", "AB"];

export const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

export type MBTI = (typeof MBTI_TYPES)[number];

// id: uuid, timestamps: ISO 8601 文字列 — 将来Supabaseへ移行する際は
// このままテーブルの列（uuid / timestamptz）にマッピングできる形にしてある。
export type Person = {
  id: string;
  name: string;
  relationship: Relationship;
  birthday?: string; // "MM-DD"（年なし。Supabase移行時は date 型 or text 型で可）
  nearestStation?: string;
  mbti?: MBTI;
  bloodType?: BloodType;
  favoriteFood?: string;
  favoritePlace?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// personId は将来 Supabase の外部キー（person_id）にそのまま対応する。
export type Interaction = {
  id: string;
  personId: string;
  date: string; // "YYYY-MM-DD"
  place?: string;
  topic?: string;
  nextTopic?: string;
  gift?: string;
  createdAt: string;
};
