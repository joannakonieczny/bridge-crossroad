import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { config } from "@/util/envVariables";

const secretKey = config.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

export async function createSession(userId: string) {
  const ttl = config.EXPIRATION_TIME_MS;
  const expiresDate = new Date(Date.now() + ttl);

  const payload: SessionPayload = {
    userId,
    expiresAt: expiresDate.getTime(),
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${Math.floor(ttl / 1000)}s`)
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresDate,
  });
}

export async function deleteSession() {
  const cookie = await cookies();
  cookie.delete("session");
}


export async function encrypt(payload: SessionPayload) {
  const ttl = config.EXPIRATION_TIME_MS;
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${Math.floor(ttl / 1000)}s`)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log(error);
  }
}