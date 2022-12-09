import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const publicKey = Buffer.from(
  String(process.env.ACCESS_TOKEN_PUBLIC_KEY),
  'base64',
).toString('ascii');

const privateKey = Buffer.from(
  String(process.env.ACCESS_TOKEN_PRIVATE_KEY),
  'base64',
).toString('ascii');

const signJwt = (payload: string | object | Buffer) => {
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
  });
};

const decode = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    return decoded;
  } catch (error) {
    console.error(`error`, error);
    return null;
  }
};

export { decode, signJwt };
