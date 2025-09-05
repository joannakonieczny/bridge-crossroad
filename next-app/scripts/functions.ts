"server-only";

import { createNewUser } from "../src/repositories/user-auth";
import { registerFormSchema } from "../src/schemas/pages/auth/register/register-schema";

export async function addAdminUser() {
  const rawJsonInput = process.env._MASTER_USER_JSON || process.argv[2];
  const jsonInput = JSON.parse(rawJsonInput);
  const parsedPayload = registerFormSchema.parse({
    ...jsonInput,
    repeatPassword: jsonInput.password,
    rememberMe: false,
  });

  const user = await createNewUser({
    email: parsedPayload.email,
    password: parsedPayload.password,
    firstName: parsedPayload.firstName,
    lastName: parsedPayload.lastName,
    nickname: parsedPayload.nickname,
  });

  console.info("User created:", user);
}
