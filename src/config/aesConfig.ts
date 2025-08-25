const webcrypto = {
  jwa: {
    format: 'jwk',
    alg: { name: 'RSA-OAEP', hash: 'SHA-256', length: 2048 },
    keyUsages: ['encrypt'],
  },
  aes: {
    alg: { name: 'AES-GCM', length: 256 },
    format: 'raw',
    keyUsages: ['encrypt', 'decrypt'],
  },
} as const;

export default webcrypto;
