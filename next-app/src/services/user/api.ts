"use server";

import { updateUserEmail } from "@/repositories/user-auth";
import { fullAuthAction } from "@/services/action-lib";
import { changeEmailSchema } from "@/schemas/pages/with-onboarding/user/user-change-schema";
import { returnValidationErrors } from "next-safe-action";
import { onDuplicateKey } from "@/repositories/common";
import type { TKey } from "@/lib/typed-translations";

export const changeEmail = fullAuthAction
  .inputSchema(changeEmailSchema)
  .action(async ({ parsedInput: formData, ctx }) => {
    await updateUserEmail({
      userId: ctx.userId,
      newEmail: formData.newEmail,
    }).catch((err) =>
      onDuplicateKey(err)
        .on("email", () =>
          returnValidationErrors(changeEmailSchema, {
            newEmail: {
              _errors: ["api.user.changeEmail.emailExists" satisfies TKey],
            },
          })
        )
        .handle()
    );
  });
