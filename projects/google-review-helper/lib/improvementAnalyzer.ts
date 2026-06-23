import {
  COMPLAINT_KEYWORDS,
  ComplaintKeyword,
  ImprovementSuggestion,
  Review,
} from "./types";

const SUGGESTIONS: Record<ComplaintKeyword, string> = {
  予約: "ご予約に関するお声が多いため、オンライン予約導線の改善を提案します。",
  電話: "電話がつながりにくいというお声が多いため、LINE予約導線の強化を提案します。",
  待ち時間:
    "待ち時間に関するお声が多いため、予約枠の見直しや受付フローの改善を提案します。",
  料金: "料金に関するお声が多いため、料金表のわかりやすい掲示を提案します。",
  接客: "接客に関するお声が多いため、スタッフ研修の実施を提案します。",
  技術: "技術面に関するお声が多いため、施術トレーニングの強化を提案します。",
};

export function analyzeImprovements(reviews: Review[]): ImprovementSuggestion[] {
  const counts = new Map<ComplaintKeyword, number>(
    COMPLAINT_KEYWORDS.map((k) => [k, 0])
  );
  for (const review of reviews) {
    for (const keyword of COMPLAINT_KEYWORDS) {
      if (review.text.includes(keyword)) {
        counts.set(keyword, (counts.get(keyword) ?? 0) + 1);
      }
    }
  }
  return COMPLAINT_KEYWORDS.map((keyword) => ({
    keyword,
    count: counts.get(keyword) ?? 0,
    suggestion: SUGGESTIONS[keyword],
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function isThisMonth(dateStr: string, today: Date): boolean {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth()
  );
}
