// Tipagens
import { type RequestBody, type ResponseBody } from '../typescript/Body';

// Configurações
import webcrypto from '@/config/aesConfig';

// Classes
import CryptoClient from './CryptoClient';
import KeysClient from './KeysClient';

export class SecurityClient {
  private keysClient = new KeysClient();

  public async init(): Promise<void> {
    await this.keysClient.init();
  }

  public async encode(data: Record<string, any>, auth: boolean = false): Promise<RequestBody> {
    try {
      if (typeof data !== 'object' && Object.keys(data).length === 0)
        throw new Error('invalid data');

      return {
        header: {
          rsa: {
            alg: webcrypto.jwa.alg.name,
            kid: KeysClient.rsa.kid,
          },
          aes: { enc: webcrypto.aes.enc },
        },
        ...(await CryptoClient.encodeData(
          data,
          { aes: this.keysClient.aes, rsa: KeysClient.rsa.key },
          auth,
        )),
      };
    } catch (error) {
      throw new Error();
    }
  }

  public async decode(body: ResponseBody): Promise<Record<string, any>> {
    try {
      const payload = JSON.parse(
        new TextDecoder().decode(await CryptoClient.decodeData(body, this.keysClient.aes)),
      );
      this.keysClient.aes = {} as ArrayBuffer;
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
export default SecurityClient;

