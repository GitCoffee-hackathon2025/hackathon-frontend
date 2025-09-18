import { jwtDecode, type JwtPayload } from 'jwt-decode';

// Funções
import verifyExp from '../verifyExp';

// Tipagens do arquivo
// type PairToken = { refresh: string; access: string };

class AuthClient {
  public static tokenRenewalErrors = ['No token', 'Invalid token', 'Expired token'] as const;

  private static cookieName = 'refreshTokenCookie_MapinhaHackathon' as const;

  private static access: string;

  public static async getAccessToken() {
    if (!this.access) throw new Error('No token');
    console.log('token', this.access)
    await verifyExp(this.access);
    console.log('token', this.access)
    return this.access;
  }

  public static async getRefreshTokenCookie(): Promise<string> {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === this.cookieName) {
          const token = decodeURIComponent(value);
        await verifyExp(token);
        return token;
      }
    }
    throw new Error('No Token');
  }

  public static async setAccessToken(access: string) {
    await verifyExp(access);
    this.access = access;
  }

  public static async setRefreshTokenCookie(refresh: string): Promise<void> {
    await verifyExp(refresh);

    const token = jwtDecode(refresh) as JwtPayload;

    const lifeTime = token.exp! - Math.floor(Date.now() / 1000);

    const cookie = `
    ${this.cookieName}=${refresh};
    SameSite=Strict;
    Max-age=${lifeTime};
    Path=/
    `;

    document.cookie = cookie.replace(/\n/g, '').trim();
  }

  public static deleteRefreshTokenCookie(): void {
    document.cookie = `${this.cookieName}=;Max-Age=0;SameSite=Strict;Path=/`;
  }
}

export default AuthClient;
