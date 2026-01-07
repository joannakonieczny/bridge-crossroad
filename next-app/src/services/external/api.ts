"use server";

import { fullAuthAction } from "@/services/action-lib";
import { z } from "zod";
import { fetchCezarPlayerByPid } from "@/repositories/cezar";
import { cezarPlayerSchema } from "@/schemas/model/cezar-player/cezar-player-schema";

export const getCezarPlayerByPidAction = fullAuthAction
  .inputSchema(z.object({ pid: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    const { pid } = parsedInput;
    const player = await fetchCezarPlayerByPid(pid);
    return cezarPlayerSchema.parse(player);
  });
