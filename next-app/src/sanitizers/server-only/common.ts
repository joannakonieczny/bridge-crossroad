import { ROUTES } from "@/routes";

export function sanitizeFileUrl(fileUrl?: string) {
  if (!fileUrl) return undefined;
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }
  return ROUTES.files.getShared(fileUrl);
}
