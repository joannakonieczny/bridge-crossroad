import { z } from "zod";
import {
  Z_NicknameOrEmailSchema,
  Z_PasswordSchema,
  Z_LoginFormSchema,
} from "./login-schema";

export type NicknameOrEmailType = z.infer<Z_NicknameOrEmailSchema>;
export type PasswordType = z.infer<Z_PasswordSchema>;
export type LoginFormType = z.infer<Z_LoginFormSchema>;
