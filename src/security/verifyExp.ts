import { jwtDecode, type JwtPayload } from 'jwt-decode';

async function verifyExp(token: string): Promise<void> {
  const content = jwtDecode(token) as JwtPayload;
  if (!content || !content.exp) throw new Error('Invalid token');

  if (Math.floor(Date.now() / 1000) >= content.exp) throw new Error('Expired token');
}

export default verifyExp;
