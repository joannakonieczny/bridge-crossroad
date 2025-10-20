import type { z } from "zod";
import type * as s from "./register-schema";

export type RegisterFormSchema = z.infer<typeof s.registerFormSchema>;
export type RepeatPasswordSchema = z.infer<typeof s.repeatPasswordSchema>;
export type PasswordSchema = z.infer<typeof s.passwordSchema>;
