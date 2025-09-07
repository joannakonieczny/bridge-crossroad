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
