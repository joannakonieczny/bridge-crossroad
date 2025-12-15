import { ROUTES } from "@/routes";

export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const keep: T[] = [];
  const remove: T[] = [];

  for (const item of array) {
    (predicate(item) ? keep : remove).push(item);
  }

  return [keep, remove];
}

export function isImageUrl(url: string | undefined): boolean {
  return !!url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

export function getFileExtension(fileUrl: string | undefined): string {
  if (!fileUrl) return "";
  const lastDot = fileUrl.lastIndexOf(".");
  if (lastDot === -1) return fileUrl;
  // take substring after last dot, strip query/hash
  const after = fileUrl.slice(lastDot + 1).split(/[?#]/)[0];
  return after || fileUrl;
}

export function desanitizeFileUrl(fileUrl?: string) {
  if (!fileUrl) return undefined;

  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }

  const prefix = ROUTES.files.getShared("");

  if (fileUrl.startsWith(prefix)) {
    return fileUrl.slice(prefix.length);
  }

  return fileUrl;
}
