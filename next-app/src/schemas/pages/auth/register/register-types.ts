import { z } from "zod";
import {
  registerFormSchema,
  repeatPasswordSchema,
  passwordSchema,
} from "./register-schema";

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
export type RepeatPasswordSchema = z.infer<typeof repeatPasswordSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
