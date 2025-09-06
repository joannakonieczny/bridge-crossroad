"server-only";

import { createGroup } from "@/repositories/groups";
import { createNewUser, findExisting } from "../src/repositories/user-auth";
import { registerFormSchema } from "../src/schemas/pages/auth/register/register-schema";
import { addAdminToGroup, addUserToGroup } from "@/repositories/user-groups";

export async function addAdminUser() {
  const rawJsonInput = process.env._MASTER_USER_JSON || process.argv[2];
  const jsonInput = JSON.parse(rawJsonInput);
  const parsedPayload = registerFormSchema.parse({
    ...jsonInput,
    repeatPassword: jsonInput.password,
    rememberMe: false,
  });

  const existingUser = await findExisting({
    email: parsedPayload.email,
    password: parsedPayload.password,
  });

  if (existingUser) {
    console.warn("Admin user already exists:", existingUser);
    console.warn("Skipping admin account creation...");
    return existingUser;
  }

  const user = await createNewUser({
    email: parsedPayload.email,
    password: parsedPayload.password,
    firstName: parsedPayload.firstName,
    lastName: parsedPayload.lastName,
    nickname: parsedPayload.nickname,
  });

  console.info("User created:", user);
  return user;
}

export async function addMainGroup() {
  const rawJsonInput = process.env._MASTER_GROUP_JSON || process.argv[2];
  const jsonInput = JSON.parse(rawJsonInput);
  // TODO add schema

  const group = await createGroup({
    name: jsonInput.name,
    description: jsonInput.description,
    imageUrl: jsonInput.imageUrl,
  });

  console.info("Group created:", group);
  return group;
}

export async function setupMasterData() {
  const user = await addAdminUser();
  const group = await addMainGroup();

  const props = { groupId: group._id.toString(), userId: user._id.toString() };

  await addUserToGroup(props);
  console.info(`Added user ${user.email} to group ${group.name}`);
  await addAdminToGroup(props);
  console.info(`Promoted user ${user.email} to admin in group ${group.name}`);
}
