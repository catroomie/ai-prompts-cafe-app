import { COMPLAINT_KEYWORDS, ComplaintKeyword, Review, Tone } from "./types";

const KEYWORD_TOPIC: Record<ComplaintKeyword, string> = {
  予約: "ご予約のしやすさ",
  電話: "お電話のつながりやすさ",
  待ち時間: "お待たせしてしまった時間",
  料金: "料金面",
  接客: "接客対応",
  技術: "施術・技術面",
};

function findKeyword(text: string): ComplaintKeyword | null {
  return COMPLAINT_KEYWORDS.find((k) => text.includes(k)) ?? null;
}

export function generateReply(review: Review, tone: Tone): string {
  const keyword = findKeyword(review.text);
  const topic = keyword ? KEYWORD_TOPIC[keyword] : null;

  if (review.rating <= 2) {
    const topicPhrase = topic ?? "いただいたご指摘";
    if (tone === "polite") {
      return `この度はご不便・ご迷惑をおかけし、誠に申し訳ございませんでした。${topicPhrase}につきまして真摯に受け止め、改善に努めてまいります。貴重なご意見をいただき、ありがとうございました。`;
    }
    if (tone === "soft") {
      return `ご不便をおかけしてしまい申し訳ありません…${topicPhrase}、しっかり見直していきますね。教えていただきありがとうございます🙏`;
    }
    return `ご迷惑をおかけし申し訳ございません。${topicPhrase}は改善いたします。貴重なご意見ありがとうございました。`;
  }

  if (review.rating === 3) {
    const topicPhrase = topic ?? "いただいたご感想";
    if (tone === "polite") {
      return `この度は貴重なご意見をいただき、誠にありがとうございます。${topicPhrase}につきまして、今後の改善材料とさせていただきます。またのご来店をお待ちしております。`;
    }
    if (tone === "soft") {
      return `ご感想ありがとうございます！${topicPhrase}、参考にさせていただきますね😊またのご来店お待ちしています！`;
    }
    return `ご意見ありがとうございます。${topicPhrase}は今後の参考にいたします。`;
  }

  const topicPhrase = topic ?? "あたたかいお言葉";
  if (tone === "polite") {
    return `この度はご来店いただき、誠にありがとうございました。${topicPhrase}とのお言葉、スタッフ一同大変励みになります。今後も変わらぬサービスを提供できるよう努めてまいります。`;
  }
  if (tone === "soft") {
    return `あたたかいお言葉ありがとうございます！${topicPhrase}って言っていただけてとても嬉しいです😊またのご来店お待ちしています！`;
  }
  return `ご来店ありがとうございました。${topicPhrase}、嬉しいです。またお待ちしております。`;
}
