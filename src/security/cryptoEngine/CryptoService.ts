import { CompactEncrypt, compactDecrypt, type JWK } from 'jose';
class CryptoService {
  private constants = {
    jwa: {
      rsa: { alg: 'RSA-OAEP-256' },
      aes: { alg: 'dir', enc: 'A256GCM' },
    },
    webcrypto: {
      jwa: {
        format: 'jwk',
        alg: { name: 'RSA-OAEP', hash: 'SHA-256' },
        keyUsages: ['encrypt'],
      },
      aes: {
        alg: { name: 'AES-GCM', length: 256 },
        format: 'raw',
        keyUsages: ['encrypt', 'decrypt'],
      },
    },
  } as const;

  private async createAESSymmetricKey(): Promise<
    { status: false; result: Error } | { status: true; result: CryptoKey }
  > {
    try {
      return {
        status: true,
        result: await crypto.subtle.generateKey(
          this.constants.webcrypto.aes.alg,
          true,
          this.constants.webcrypto.aes.keyUsages
        ),
      };
    } catch (error) {
      return { status: false, result: new Error(String(error)) };
    }
  }

  private async encodeAES(
    data: Record<string, any>,
    aes: CryptoKey
  ): Promise<
    | {
        status: false;
        result: Error;
      }
    | {
        status: true;
        result: string;
      }
  > {
    try {
      // validando parâmetros recebidos da chamada
      if (typeof data != 'object')
        return {
          status: false,
          result: new Error('data is not a object'),
        };
      if (aes.algorithm.name != this.constants.webcrypto.aes.alg.name)
        return {
          status: false,
          result: new Error('invalid name aes key'),
        };
      // criptografando dado
      const bufferData = new TextEncoder().encode(JSON.stringify(data));
      return {
        status: true,
        result: await new CompactEncrypt(bufferData)
          .setProtectedHeader(this.constants.jwa.aes)
          .encrypt(aes),
      };
    } catch (error) {
      return { status: false, result: new Error(String(error)) };
    }
  }

  private async importRSA(rsa: JWK) {
    return await crypto.subtle.importKey(
      this.constants.webcrypto.jwa.format,
      rsa,
      this.constants.webcrypto.jwa.alg,
      true,
      this.constants.webcrypto.jwa.keyUsages
    );
  }

  // necessário ser feito usando axios
  private async getRSAPublicKey(): Promise<
    | {
        status: false;
        result: Error;
      }
    | {
        status: true;
        result: { key: CryptoKey; version: string };
      }
  > {
    try {
      // requisitando a chave RSA do servidor e criar validações
      const rsa: { key: JWK; version: string } = { key: {}, version: '' };

      // enviando chave recém importada
      return {
        status: true,
        result: {
          key: await this.importRSA(rsa.key),
          version: rsa.version,
        },
      };
    } catch (error) {
      return { status: false, result: new Error(String(error)) };
    }
  }

  public async encode(
    data: Record<string, any>,
    oldRSA?: { key: JWK; version: string }
  ): Promise<
    | {
        status: false;
        result: Error;
      }
    | {
        status: true;
        result: {
          body: string;
          keyAES: ArrayBuffer;
        };
      }
  > {
    try {
      // definindo chaves
      const rsa = oldRSA
        ? {
            status: true,
            result: { key: await this.importRSA(oldRSA.key), version: oldRSA.version },
          }
        : await this.getRSAPublicKey();
      if (rsa.status === false) throw rsa.result;

      const aes = await this.createAESSymmetricKey();
      if (aes.status === false) throw aes.result;

      // criptografando dado com a chave AES
      const encryptedData = await this.encodeAES(data, aes.result);
      if (encryptedData.status === false) throw encryptedData.result;

      const bufferAES = await crypto.subtle.exportKey(
        this.constants.webcrypto.aes.format,
        aes.result
      );

      const wrappedAES = await new CompactEncrypt(new Uint8Array(bufferAES))
        .setProtectedHeader({
          alg: this.constants.jwa.rsa.alg,
          enc: this.constants.jwa.aes.enc,
          kid: rsa.result.version,
        })
        .encrypt(rsa.result.key);

      const body = wrappedAES + ':::' + encryptedData.result;

      return {
        status: true,
        result: {
          body,
          keyAES: bufferAES,
        },
      };
    } catch (error) {
      return { status: false, result: new Error(String(error)) };
    }
  }

  public async decode(
    body: string,
    bufferAES: ArrayBuffer
  ): Promise<
    | {
        status: false;
        result: Error;
      }
    | {
        status: true;
        result: Record<string, any>;
      }
  > {
    try {
      const aes = await crypto.subtle.importKey(
        this.constants.webcrypto.aes.format,
        bufferAES,
        this.constants.webcrypto.aes.alg,
        true,
        this.constants.webcrypto.aes.keyUsages
      );

      const { plaintext, protectedHeader } = await compactDecrypt(body, aes);

      if (protectedHeader.alg !== this.constants.jwa.aes.alg)
        throw new Error('arg different from the original');
      if (protectedHeader.enc !== this.constants.jwa.aes.enc)
        throw new Error('enc different from the original');

      const payload = JSON.parse(new TextDecoder().decode(plaintext));

      if (typeof payload !== 'object' || payload === null || Array.isArray(payload))
        throw new Error('data in invalid format');

      return {
        status: true,
        result: payload,
      };
    } catch (error) {
      return {
        status: false,
        result: new Error(String(error)),
      };
    }
  }
}

const cryptoService = new CryptoService();
export default cryptoService;