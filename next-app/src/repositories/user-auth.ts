"server-only";

import User from "@/models/user/user-model";
import dbConnect from "@/util/connect-mongo";
import bcrypt from "bcryptjs";
import { check, RepositoryError } from "./common";
import type { IUserDTO } from "@/models/user/user-types";
import type {
  EmailType,
  FirstNameType,
  LastNameType,
  NicknameType,
  PasswordTypeGeneric,
  UserIdType,
} from "@/schemas/model/user/user-types";

export type CreateUserParams = {
  email: EmailType;
  password: PasswordTypeGeneric;
  firstName: FirstNameType;
  lastName: LastNameType;
  nickname?: NicknameType;
};

const hashingRounds = 10;

export async function createNewUser(params: CreateUserParams) {
  await dbConnect();

  const salt = await bcrypt.genSalt(hashingRounds);
  const encodedPassword = await bcrypt.hash(params.password, salt);

  const userData = {
    email: params.email,
    encodedPassword: encodedPassword,
    name: {
      firstName: params.firstName,
      lastName: params.lastName,
    },
    nickname: params.nickname,
  };

  const newUser = await new User(userData).save();
  return check(newUser.toObject() as IUserDTO, "Failed to create user");
}

type FindIfExistByEmailParams = {
  email: EmailType;
  password: PasswordTypeGeneric;
};

type FindIfExistByNicknameParams = {
  nickname: NicknameType;
  password: PasswordTypeGeneric;
};

export type FindIfExistParams =
  | FindIfExistByEmailParams
  | FindIfExistByNicknameParams;

export async function findExisting(params: FindIfExistParams) {
  await dbConnect();

  let user: IUserDTO | null = null;

  if ("email" in params) {
    user = await User.findOne({ email: params.email }).lean<IUserDTO>();
  } else if ("nickname" in params) {
    user = await User.findOne({ nickname: params.nickname }).lean<IUserDTO>();
  }

  if (user) {
    const isPasswordValid = await bcrypt.compare(
      params.password,
      user.encodedPassword
    );

    if (isPasswordValid) {
      return user as IUserDTO;
    }
  }

  throw new RepositoryError("Invalid credentials");
}

export type UpdateUserEmailParams = {
  userId: UserIdType;
  newEmail: EmailType;
};

export async function updateUserEmail(params: UpdateUserEmailParams) {
  await dbConnect();

  const updatedUser = await User.findByIdAndUpdate(
    params.userId,
    { email: params.newEmail },
    {
      new: true,
      runValidators: true,
    }
  ).lean<IUserDTO>();

  return check(updatedUser, "Failed to update user email");
}

export type UpdateUserPasswordParams = {
  userId: UserIdType;
  oldPassword: PasswordTypeGeneric;
  newPassword: PasswordTypeGeneric;
};

export async function updateUserPassword(params: UpdateUserPasswordParams) {
  await dbConnect();

  const user = await User.findById(params.userId).lean<IUserDTO>();
  if (!user) throw new RepositoryError("User not found");

  const isPasswordValid = await bcrypt.compare(
    params.oldPassword,
    user.encodedPassword
  );

  if (!isPasswordValid) {
    throw new RepositoryError("Invalid password");
  }

  const salt = await bcrypt.genSalt(hashingRounds);
  const encodedPassword = await bcrypt.hash(params.newPassword, salt);

  const updatedUser = await User.findByIdAndUpdate(
    params.userId,
    { encodedPassword },
    { new: true }
  ).lean<IUserDTO>();

  return check(updatedUser, "Failed to update user password");
}

export type UpdateUserProfileParams = {
  userId: UserIdType;
  firstName: FirstNameType;
  lastName: LastNameType;
  nickname?: NicknameType;
};

export async function updateUserProfile(params: UpdateUserProfileParams) {
  await dbConnect();

  const update = {
    $set: Object.fromEntries(
      Object.entries({
        "name.firstName": params.firstName,
        "name.lastName": params.lastName,
        nickname: params.nickname,
      }).filter(([, value]) => value !== undefined)
    ),

    $unset: Object.fromEntries(
      Object.entries({
        nickname: params.nickname,
      })
        .filter(([, value]) => value === undefined)
        .map(([key]) => [key, ""])
    ),
  };

  const updatedUser = await User.findByIdAndUpdate(params.userId, update, {
    new: true,
    runValidators: true,
  }).lean<IUserDTO>();

  return check(updatedUser, "Failed to update user profile");
}
