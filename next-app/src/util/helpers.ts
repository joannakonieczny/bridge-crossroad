export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const keep: T[] = [];
  const remove: T[] = [];

  for (const item of array) {
    (predicate(item) ? keep : remove).push(item);
  }

  return [keep, remove];
}
