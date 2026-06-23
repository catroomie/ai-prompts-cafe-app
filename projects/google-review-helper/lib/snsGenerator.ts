import { ComplaintKeyword, ImprovementSuggestion } from "./types";

const ACTION_PHRASES: Record<ComplaintKeyword, string> = {
  予約: "オンライン予約をより使いやすくリニューアル",
  電話: "LINEでの簡単予約をスタート",
  待ち時間: "受付の流れを見直し、お待たせする時間を短縮",
  料金: "料金表をわかりやすくリニューアル",
  接客: "スタッフの接客研修を実施",
  技術: "技術向上のための研修を実施",
};

export function generateSnsPost(
  suggestion: ImprovementSuggestion,
  storeName: string
): string {
  const action = ACTION_PHRASES[suggestion.keyword];
  const hashtag = storeName.replace(/\s/g, "");
  return `📢 ${storeName}からのお知らせ

いつもご利用いただきありがとうございます😊
この度、${action}いたしました！

より快適にご利用いただけるよう、スタッフ一同頑張ります💪
皆さまのご来店を心よりお待ちしております🌿

#${hashtag} #口コミ改善 #接客`;
}
