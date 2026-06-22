import Link from "next/link";
import { daysSince, daysUntilBirthday } from "@/lib/date";
import { Interaction, Person } from "@/lib/types";

export default function PersonCard({
  person,
  latestInteraction,
}: {
  person: Person;
  latestInteraction?: Interaction;
}) {
  const birthdayDays = person.birthday
    ? daysUntilBirthday(person.birthday)
    : null;
  const isBirthdaySoon = birthdayDays !== null && birthdayDays <= 14;

  const metInfo = latestInteraction
    ? daysSince(latestInteraction.date) === 0
      ? "今日会った"
      : `${daysSince(latestInteraction.date)}日前に会った`
    : "会った記録なし";

  const sub = [person.favoriteFood, person.favoritePlace]
    .filter(Boolean)
    .join(" / ");

  return (
    <Link
      href={`/people/${person.id}`}
      className="tap-target block rounded-xl border border-(--border) bg-(--card-bg) p-4 active:scale-[0.99] transition shadow-(--shadow)"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-base truncate">{person.name}</span>
        <span className="shrink-0 text-xs rounded-full bg-(--tag-bg) px-2.5 py-1 text-(--subtext)">
          {person.relationship}
        </span>
      </div>
      {sub && (
        <p className="text-sm text-(--subtext) mt-1.5 truncate">{sub}</p>
      )}
      <div className="flex items-center gap-2 mt-2 text-xs text-(--subtext)">
        <span>{metInfo}</span>
        {isBirthdaySoon && (
          <span className="rounded-full bg-(--accent) text-white px-2 py-0.5">
            {birthdayDays === 0 ? "今日誕生日" : `誕生日まで${birthdayDays}日`}
          </span>
        )}
      </div>
    </Link>
  );
}
