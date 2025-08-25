import { decode, type JwtPayload } from 'jsonwebtoken';

async function verifyExp(token: string) {
  const content = decode(token) as JwtPayload;
  if (!content || !content.exp) return false;
  return Math.floor(Date.now() / 1000) < content.exp;
}

export default verifyExp;