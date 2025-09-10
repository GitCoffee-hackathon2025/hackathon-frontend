function concatArrayBuffer(buf1: ArrayBuffer, buf2: ArrayBuffer): ArrayBuffer {
  const tmp = new Uint8Array(buf1.byteLength + buf2.byteLength);

  tmp.set(new Uint8Array(buf1), 0);
  tmp.set(new Uint8Array(buf2), buf1.byteLength);

  return tmp.buffer;
}

export default concatArrayBuffer;