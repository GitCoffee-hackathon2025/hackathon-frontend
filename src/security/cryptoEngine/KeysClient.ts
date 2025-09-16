// Configurações
import webcrypto from '@/config/aesConfig';

// Funções
import BufferConverter from '../utils/BufferConverter';

class KeysClient {
  public static connected: string;

  private _init: boolean = false;

  public aes!: ArrayBuffer;
  public static rsa: { key: JsonWebKey; kid: `${number}v` };

  public async init(): Promise<void> {
    // verificando se já foi iniciado
    if (this._init) return;
    this._init = true;
    if(!this.init){ const rsa = await fetch(`${import.meta.env.VITE_API_URL}/connect/get`)
    if (!rsa.ok) throw new Error('Error fetching RSA key');
    const rsaJson = await rsa.json() as { rsaPublicKey: JsonWebKey; kidRsa: `${number}v` };
    console.log(rsaJson);
    KeysClient.rsa = { key: rsaJson.rsaPublicKey, kid: rsaJson.kidRsa };}

  
   
    // gerando chave
    const key = await crypto.subtle.generateKey(webcrypto.aes.alg, true, webcrypto.aes.keyUsages);

    // exportando chave
    this.aes = await crypto.subtle.exportKey(webcrypto.aes.format, key);

    if (!KeysClient.connected)
      KeysClient.connected = BufferConverter.arrayBufferToBase64(
        this.aes.slice(this.aes.byteLength - 16),
      );
  }

  public static async importAES(aes: ArrayBuffer): Promise<CryptoKey> {
    return await crypto.subtle.importKey(webcrypto.aes.format, aes, webcrypto.aes.alg.name, true, [
      ...webcrypto.aes.keyUsages,
    ]);
  }

  public static async importRSA(rsa: JsonWebKey): Promise<CryptoKey> {
    const { name, hash } = webcrypto.jwa.alg;
    return await crypto.subtle.importKey(
      webcrypto.jwa.format,
      rsa,
      { name, hash },
      true,
      webcrypto.jwa.keyUsages,
    );
  }
}

export function setRSAPublicKey(key: typeof KeysClient.rsa): void {
  if (!key.key || !key.kid) throw new Error('Incomplete key');
  KeysClient.rsa = { ...key };
}

export default KeysClient;
