import { Interaction, Person } from "./types";

const PEOPLE_KEY = "people-memo:people";
const INTERACTIONS_KEY = "people-memo:interactions";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getPeople(): Person[] {
  return read<Person>(PEOPLE_KEY).sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1
  );
}

export function getPerson(id: string): Person | undefined {
  return read<Person>(PEOPLE_KEY).find((p) => p.id === id);
}

export function savePerson(person: Person) {
  const people = read<Person>(PEOPLE_KEY);
  const idx = people.findIndex((p) => p.id === person.id);
  if (idx >= 0) {
    people[idx] = person;
  } else {
    people.push(person);
  }
  write(PEOPLE_KEY, people);
}

export function deletePerson(id: string) {
  write(
    PEOPLE_KEY,
    read<Person>(PEOPLE_KEY).filter((p) => p.id !== id)
  );
  write(
    INTERACTIONS_KEY,
    read<Interaction>(INTERACTIONS_KEY).filter((i) => i.personId !== id)
  );
}

export function getInteractions(personId: string): Interaction[] {
  return read<Interaction>(INTERACTIONS_KEY)
    .filter((i) => i.personId === personId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllInteractions(): Interaction[] {
  return read<Interaction>(INTERACTIONS_KEY);
}

// person.id ごとの最新の会った記録（無ければキーなし）
export function getLatestInteractionMap(): Record<string, Interaction> {
  const map: Record<string, Interaction> = {};
  for (const interaction of getAllInteractions()) {
    const current = map[interaction.personId];
    if (!current || interaction.date > current.date) {
      map[interaction.personId] = interaction;
    }
  }
  return map;
}

export function saveInteraction(interaction: Interaction) {
  const interactions = read<Interaction>(INTERACTIONS_KEY);
  const idx = interactions.findIndex((i) => i.id === interaction.id);
  if (idx >= 0) {
    interactions[idx] = interaction;
  } else {
    interactions.push(interaction);
  }
  write(INTERACTIONS_KEY, interactions);
}

export function deleteInteraction(id: string) {
  write(
    INTERACTIONS_KEY,
    read<Interaction>(INTERACTIONS_KEY).filter((i) => i.id !== id)
  );
}
