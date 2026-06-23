import {
  COMPLAINT_KEYWORDS,
  ComplaintKeyword,
  ImprovementSuggestion,
  Review,
} from "./types";

const SUGGESTIONS: Record<ComplaintKeyword, string> = {
  予約: "「予約が取りにくい」というお声が目立ちます。ネット予約を取り入れると、取りこぼしを減らせます。",
  電話: "「電話がつながらない」というお声が目立ちます。LINE予約を案内すると、機会損失を防げます。",
  待ち時間:
    "「待ち時間が長い」というお声があります。予約枠と受付の流れを見直してみましょう。",
  料金: "「料金がわかりにくい」というお声があります。料金表をはっきり掲示すると、安心につながります。",
  接客: "「接客が気になる」というお声があります。スタッフで対応を振り返る時間をつくりましょう。",
  技術: "「仕上がりが気になる」というお声があります。技術の振り返りで満足度を高められます。",
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
