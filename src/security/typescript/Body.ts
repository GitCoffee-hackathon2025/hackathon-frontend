export interface RequestBody {
  header: {
    rsa: { alg: string; kid: `${number}v` };
    aes: { enc: string };
  };
  ek: string;
  iv: string;
  ct: string;
  tag: string;
}

export interface ResponseBody {
  iv: string;
  ct: string;
  tag: string;
}
