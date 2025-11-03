type Person = {
  nickname?: string;
  name: { firstName: string; lastName: string };
};

export function getPersonLabel(person: Person) {
  return person.nickname
    ? `${person.name.firstName} ${person.name.lastName} (${person.nickname})`
    : `${person.name.firstName} ${person.name.lastName}`;
}
