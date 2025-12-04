export const MAX_SIZE = 10 * 1024 * 1024; // 10 MB limit

export const ALLOWED_MIME_TYPE_IMAGE = new Set<string>([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

export const ALLOWED_MIME = new Set<string>([
  ...ALLOWED_MIME_TYPE_IMAGE,
  "application/pdf",
  "text/plain",
  "application/zip",
]);

export const ALLOWED_EXT_IMAGE = new Set<string>([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
]);

export const ALLOWED_EXT = new Set<string>([
  ...ALLOWED_EXT_IMAGE,
  "pdf",
  "txt",
  "zip",
]);
