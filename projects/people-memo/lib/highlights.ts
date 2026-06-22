import { daysSince, daysUntilBirthday } from "./date";
import { Interaction, Person } from "./types";

const BIRTHDAY_SOON_DAYS = 14;
const NOT_MET_RECENTLY_DAYS = 60;

export type Highlight = {
  person: Person;
  reason: "birthdaySoon" | "notMetRecently" | "pendingTopic";
  label: string;
};

export function getTodayHighlights(
  people: Person[],
  latestInteractionByPersonId: Record<string, Interaction>
): Highlight[] {
  const highlights: Highlight[] = [];

  for (const person of people) {
    if (person.birthday) {
      const days = daysUntilBirthday(person.birthday);
      if (days !== null && days <= BIRTHDAY_SOON_DAYS) {
        highlights.push({
          person,
          reason: "birthdaySoon",
          label: days === 0 ? "今日が誕生日" : `誕生日まであと${days}日`,
        });
      }
    }

    const latest = latestInteractionByPersonId[person.id];
    if (latest) {
      const days = daysSince(latest.date);
      if (days >= NOT_MET_RECENTLY_DAYS) {
        highlights.push({
          person,
          reason: "notMetRecently",
          label: `最後に会ってから${days}日`,
        });
      }
      if (latest.nextTopic) {
        highlights.push({
          person,
          reason: "pendingTopic",
          label: latest.nextTopic,
        });
      }
    }
  }

  const order: Record<Highlight["reason"], number> = {
    birthdaySoon: 0,
    pendingTopic: 1,
    notMetRecently: 2,
  };
  return highlights.sort((a, b) => order[a.reason] - order[b.reason]);
}
