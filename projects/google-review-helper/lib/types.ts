export type Rating = 1 | 2 | 3 | 4 | 5;

export type Tone = "polite" | "soft" | "short";

export const TONES: Tone[] = ["polite", "soft", "short"];

export const TONE_LABELS: Record<Tone, string> = {
  polite: "丁寧",
  soft: "やわらかい",
  short: "短め",
};

export type Review = {
  id: string;
  reviewerName: string;
  rating: Rating;
  text: string;
  postedAt: string; // "YYYY-MM-DD"
  replied: boolean;
  replyText?: string;
  createdAt: string;
};

export type Store = {
  name: string;
};

export const COMPLAINT_KEYWORDS = [
  "予約",
  "電話",
  "待ち時間",
  "料金",
  "接客",
  "技術",
] as const;

export type ComplaintKeyword = (typeof COMPLAINT_KEYWORDS)[number];

export type ImprovementSuggestion = {
  keyword: ComplaintKeyword;
  count: number;
  suggestion: string;
};
