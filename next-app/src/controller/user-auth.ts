"server-only";

import User, { IUserDTO } from "@/models/user";
import dbConnect from "@/util/connect-mongo";
import bcrypt from "bcryptjs";

export type CreateUserParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nickname?: string;
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
  email: string;
  password: string;
};

type FindIfExistByNicknameParams = {
  nickname: string;
  password: string;
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
