// 密钥对生成 http://web.chacuo.net/netrsakeypair

import JSEncrypt from 'jsencrypt';

/**
 * 加密
 * @param txt 需要加密的数据
 * @returns 加密后的数据
 */
export function encrypt(txt: string, rsaPublicKey: string) {
  const instance = new JSEncrypt();
  instance.setPublicKey(rsaPublicKey);
  return instance.encrypt(txt);
}

/**
 * 解密
 * @param txt 需要解密的数据
 * @returns 解密后的数据
 */
export function decrypt(txt: string, rsaPrivateKey: string) {
  const instance = new JSEncrypt();
  instance.setPrivateKey(rsaPrivateKey);
  return instance.decrypt(txt);
}
