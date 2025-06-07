import User, { IUserDTO } from "@/models/user";
import dbConnect from "@/util/connect-mongo";

export type CreateUserParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nickname?: string;
};

export async function createNewUser(
  params: CreateUserParams
): Promise<IUserDTO> {
  await dbConnect();

  const userData = {
    email: params.email,
    encodedPassword: params.password, // TODO
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

  if ("email" in params) {
    return User.findOne({
      email: params.email,
      encodedPassword: params.password,
    });
  } else if ("nickname" in params) {
    return User.findOne({
      nickname: params.nickname,
      encodedPassword: params.password,
    });
  }

  return null;
}
