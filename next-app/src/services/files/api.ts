"use server";

import {
  uploadFileToS3,
  getObjectFromS3,
  getFileNamesInS3Folder,
} from "@/repositories/files";
import { getWithinOwnGroupAction } from "../action-lib";
import z from "zod";

export const uploadFile = getWithinOwnGroupAction(
  z.object({
    fileName: z.string(),
  })
).action(async ({ parsedInput, ctx }) => {
  const fileKey = `${ctx.groupId}/${parsedInput.fileName}`;
  await uploadFileToS3(fileKey, parsedInput.fileName);
});

export const getFile = getWithinOwnGroupAction(
  z.object({
    fileName: z.string(),
  })
).action(async ({ parsedInput, ctx }) => {
  const fileKey = `${ctx.groupId}/${parsedInput.fileName}`;
  const fileUrl = await getObjectFromS3(fileKey);
  return fileUrl;
});

export const listItemsInFolder = getWithinOwnGroupAction(
  z.object({
    folderPath: z.string(),
  })
).action(async ({ parsedInput, ctx }) => {
  const fileKeys = await getFileNamesInS3Folder(
    `${ctx.groupId}/${parsedInput.folderPath}`
  );
  return fileKeys;
});
