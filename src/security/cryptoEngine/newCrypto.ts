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
    iv: Uint8Array<ArrayBuffer>;
    ek: ArrayBuffer;
  }> {
    // criando vetor de inicialização para ser usado na encriptação
    const iv = crypto.getRandomValues(new Uint8Array(12));

    return {
      // criptografando a chave
      ct: await crypto.subtle.encrypt({ ...webcrypto.jwa.alg, iv }, await this.importRSA(rsa), aes),
      // enviando vetor de inicialização
      iv,
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
/* 

{
  "header": {
    "rsa": { "alg": "RSA-OAEP-256", "length": 2048 },
    "aes": { "enc": "A256GCM" }
  },
  "ek": "<RSA_encrypted_AES_key_base64url>",
  "iv": "<AES_GCM_iv_base64url>",
  "ct": "<AES_GCM_ciphertext_plus_tag_base64url>"
}

*/
