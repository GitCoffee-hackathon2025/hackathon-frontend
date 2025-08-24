import getBrowserFingerprint from 'get-browser-fingerprint';
import { load } from '@fingerprintjs/fingerprintjs';

async function browserFingerprint() {
  const ids = {
    number: await getBrowserFingerprint(),
    string: (await (await load()).get()).visitorId,
  };
  return ids;
}

export default browserFingerprint;
