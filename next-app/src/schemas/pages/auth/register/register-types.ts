import type { z } from "zod";
import type {
  registerFormSchema,
  repeatPasswordSchema,
  passwordSchema,
} from "./register-schema";

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
export type RepeatPasswordSchema = z.infer<typeof repeatPasswordSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
