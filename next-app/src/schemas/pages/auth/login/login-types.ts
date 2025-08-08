import { z } from "zod";
import {
  nicknameOrEmailSchema,
  passwordSchema,
  loginFormSchema,
} from "./login-schema";

export type NicknameOrEmailType = z.infer<typeof nicknameOrEmailSchema>;
export type PasswordType = z.infer<typeof passwordSchema>;
export type LoginFormType = z.infer<typeof loginFormSchema>;
