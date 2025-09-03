"server-only";

import type { IUserDTO } from "@/models/user/user-types";
import User from "@/models/user/user-model";
import type {
  EmailType,
  FirstNameType,
  LastNameType,
  NicknameType,
  PasswordTypeGeneric,
} from "@/schemas/model/user/user-types";
import dbConnect from "@/util/connect-mongo";
import bcrypt from "bcryptjs";

export type CreateUserParams = {
  email: EmailType;
  password: PasswordTypeGeneric;
  firstName: FirstNameType;
  lastName: LastNameType;
  nickname?: NicknameType;
};

const hashingRounds = 10;

export async function createNewUser(
  params: CreateUserParams
): Promise<IUserDTO> {
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

  const newUser = new User(userData);
  await newUser.save();

  return newUser.toObject();
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

export async function findExisting(
  params: FindIfExistParams
): Promise<IUserDTO | null> {
  await dbConnect();

  let user: IUserDTO | null = null;

  if ("email" in params) {
    user = await User.findOne({ email: params.email });
  } else if ("nickname" in params) {
    user = await User.findOne({ nickname: params.nickname });
  }

  if (user) {
    const isPasswordValid = await bcrypt.compare(
      params.password,
      user.encodedPassword
    );

    if (isPasswordValid) {
      return user;
    }
  }

  return null;
}
