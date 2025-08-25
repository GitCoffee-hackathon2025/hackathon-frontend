import getBrowserFingerprint from 'get-browser-fingerprint';
import { load } from '@fingerprintjs/fingerprintjs';

async function browserFingerprint() {
  return {
    number: await getBrowserFingerprint(),
    string: (await (await load()).get()).visitorId,
  };
}

export default browserFingerprint;
