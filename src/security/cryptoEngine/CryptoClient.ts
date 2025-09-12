// Tipagens
import { type RequestBody, type ResponseBody } from '../typescript/Body';

// Configurações
import webcrypto from '@/config/aesConfig';

// Funções
import browserFingerprint from '../browserFingerprint';
import BufferConverter from '../utils/BufferConverter';
import concatArrayBuffer from '../utils/concatArrayBuffer';

// Classes
import KeysClient from './KeysClient';

class CryptoClient {
  public static async encodeData(
    data: Record<string, any>,
    { aes, rsa }: { aes: ArrayBuffer; rsa: JsonWebKey },
    auth: boolean,
  ): Promise<Omit<RequestBody, 'header'>> {
    // criando vetor de inicialização para ser usado na encriptação
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const { ciphertext, tag } = await crypto.subtle
      .encrypt(
        { name: webcrypto.aes.alg.name, iv },
        await KeysClient.importAES(aes),
        new TextEncoder().encode(
          JSON.stringify({
            data,
            browser: auth
              ? {
                  auth: await browserFingerprint(),
                  connect: KeysClient.connected,
                }
              : null,
          }),
        ),
      )
      .then((ek) => ({
        ciphertext: ek.slice(0, ek.byteLength - 16),
        tag: ek.slice(ek.byteLength - 16),
      }));

    return {
      // criptografando a chave
      ek: BufferConverter.arrayBufferToBase64(
        await crypto.subtle.encrypt(
          // criando uma função autoexecutavel que retorna o name e hash
          (({ name, hash }) => ({ name, hash }))(webcrypto.jwa.alg),
          await KeysClient.importRSA(rsa),
          aes,
        ),
      ),
      // enviando vetor de inicialização
      iv: BufferConverter.arrayBufferToBase64(iv.buffer),
      // criptografando o dado e vendo se precisa do id
      ct: BufferConverter.arrayBufferToBase64(ciphertext),
      tag: BufferConverter.arrayBufferToBase64(tag),
    };
  }

  public static async decodeData(body: ResponseBody, aes: ArrayBuffer): Promise<ArrayBuffer> {
    if (!body.ct || !body.iv || !body.tag) throw new Error('Incomplete response');

    return await crypto.subtle.decrypt(
      {
        name: webcrypto.aes.alg.name,
        iv: new Uint8Array(BufferConverter.base64ToArrayBuffer(body.iv)),
      },
      await KeysClient.importAES(aes),
      concatArrayBuffer(
        BufferConverter.base64ToArrayBuffer(body.ct),
        BufferConverter.base64ToArrayBuffer(body.tag),
      ),
    );
  }
}

export default CryptoClient;
