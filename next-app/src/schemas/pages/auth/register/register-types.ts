import { z } from "zod";
import {
  Z_RegisterFormSchema,
  Z_RepeatPasswordSchema,
  Z_PasswordSchema,
} from "./register-schema";

export type RegisterFormSchema = z.infer<Z_RegisterFormSchema>;
export type RepeatPasswordSchema = z.infer<Z_RepeatPasswordSchema>;
export type PasswordSchema = z.infer<Z_PasswordSchema>;
