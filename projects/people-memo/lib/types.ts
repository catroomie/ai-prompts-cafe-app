export type Relationship = "友人" | "家族" | "仕事" | "知人" | "その他";

export const RELATIONSHIPS: Relationship[] = ["友人", "家族", "仕事", "知人", "その他"];

export type Person = {
  id: string;
  name: string;
  relationship: Relationship;
  birthday?: string; // "MM-DD"
  nearestStation?: string;
  likes?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

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
