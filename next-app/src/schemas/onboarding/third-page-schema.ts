import z from "zod";
import { UserOnboardingSchemaProvider } from "@/schemas/user";

export function OnboardingThirdPageSchemaProvider() {
  const { cezarIdSchema, bboIdSchema, cuebidsIdSchema } =
    UserOnboardingSchemaProvider();
  const emptyStringToUndefined = (value: string | undefined) =>
    value === "" ? undefined : value;

  const formSchema = z.object({
    cezarId: z.string().transform(emptyStringToUndefined).pipe(cezarIdSchema),
    bboId: z.string().transform(emptyStringToUndefined).pipe(bboIdSchema),
    cuebidsId: z
      .string()
      .transform(emptyStringToUndefined)
      .pipe(cuebidsIdSchema),
  });

  return {
    formSchema,
  };
}

export type OnboardingThirdPageSchema = z.infer<
  ReturnType<typeof OnboardingThirdPageSchemaProvider>["formSchema"]
>;
