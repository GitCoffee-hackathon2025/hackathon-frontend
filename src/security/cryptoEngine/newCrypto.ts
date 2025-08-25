import webcrypto from '@/config/aesConfig';

import browserFingerprint from '../browserFingerprint';
import verifyExp from '../verifyExp';

class CryptoEngine {
  private aes!: ArrayBuffer;
  private rsa!: { key: JsonWebKey; kid: number };

  private static async importAES(aes: ArrayBuffer) {
    return await crypto.subtle.importKey(
      webcrypto.aes.format,
      aes,
      webcrypto.aes.alg.name,
      true,
      webcrypto.aes.keyUsages,
    );
  }

  private static async importRSA(rsa: JsonWebKey) {
    return await crypto.subtle.importKey(
      webcrypto.jwa.format,
      rsa,
      webcrypto.jwa.alg.name,
      true,
      webcrypto.jwa.keyUsages,
    );
  }

  private _init: boolean = false;

  public async init(): Promise<boolean> {
    // verificando se já foi iniciado
    if (this._init === true) return false;
    this._init = true;

    // gerando chave
    const key = await crypto.subtle.generateKey(webcrypto.aes.alg, true, webcrypto.aes.keyUsages);

    // exportando chave
    this.aes = await crypto.subtle.exportKey(webcrypto.aes.format, key);
    return true;
  }

  private static async encodeData(
    data: Record<string, any>,
    { aes, rsa }: { aes: ArrayBuffer; rsa: JsonWebKey },
    auth: boolean = false,
  ): Promise<{
    ct: ArrayBuffer;
    ek: ArrayBuffer;
  }> {
    return {
      // criptografando a chave
      ct: await crypto.subtle.encrypt(webcrypto.jwa.alg, await this.importRSA(rsa), aes),

      // criptografando o dado e vendo se precisa do id
      ek: await crypto.subtle.encrypt(
        webcrypto.aes.alg,
        await this.importAES(aes),
        new TextEncoder().encode(
          JSON.stringify({
            data,
            browser: auth ? await browserFingerprint() : null,
          }),
        ),
      ),
    };
  }
}

/* const json = {
  header: {
    rsa: { alg: 'RSA-OAEP-256', length: 2048, iv: 'versão do rsa' },
    aes: {
      enc: 'A256GCM',
    },
  },
  ek: '',
  ct: '',
  tag: '',
}; */
