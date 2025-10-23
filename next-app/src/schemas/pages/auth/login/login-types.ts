import type { z } from "zod";
import type * as s from "./login-schema";

export type NicknameOrEmailType = z.infer<typeof s.nicknameOrEmailSchema>;
export type PasswordType = z.infer<typeof s.passwordSchema>;
export type LoginFormType = z.infer<typeof s.loginFormSchema>;
