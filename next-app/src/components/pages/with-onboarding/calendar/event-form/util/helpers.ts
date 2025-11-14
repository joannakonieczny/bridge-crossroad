type Person = {
  nickname?: string;
  name: { firstName: string; lastName: string };
};

export function getPersonLabel(person?: Person) {
  if (!person) return "-";
  return person.nickname
    ? `${person.name.firstName} ${person.name.lastName} (${person.nickname})`
    : `${person.name.firstName} ${person.name.lastName}`;
}

export type StepProps = {
  setNextStep?: () => void;
  setPrevStep?: () => void;
};
