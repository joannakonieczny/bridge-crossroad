import z from "zod";
import { UserOnboardingSchemaProvider } from "@/schemas/user";

export function OnboardingThirdPageSchemaProvider() {
  const { cezarIdSchema, bboIdSchema, cuebidsIdSchema } =
    UserOnboardingSchemaProvider();

  // TODO make them optional
  const formSchema = z.object({
    cezarId: cezarIdSchema,
    bboId: bboIdSchema,
    cuebidsId: cuebidsIdSchema,
  });

  return {
    formSchema,
  };
}

export type OnboardingThirdPageSchema = z.infer<
  ReturnType<typeof OnboardingThirdPageSchemaProvider>["formSchema"]
>;
