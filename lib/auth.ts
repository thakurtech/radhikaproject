import { jwtVerify, SignJWT } from 'jose';

interface SessionPayload {
  userId: string;
  role: string;
  schoolId?: string;
  [key: string]: any;
}

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('The environment variable JWT_SECRET is not set.');
  }
  return secret;
};

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );
    return verified.payload as SessionPayload;
  } catch (err) {
    throw new Error('Your token has expired.');
  }
};

export const signToken = async (payload: SessionPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Token expires in 1 day
    .sign(new TextEncoder().encode(getJwtSecretKey()));
};
