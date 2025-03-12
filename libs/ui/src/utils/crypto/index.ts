import { createCipheriv, createDecipheriv, createHash } from 'crypto';

const secret_key = 'ABC_Elearning1188@';
const secret_iv = 'ABC_Elearning@8386';
const encryption_method = 'aes-256-cbc';

const key = createHash('sha512')
  .update(secret_key)
  .digest('hex')
  .substring(0, 32);

const encryptionIV = createHash('sha512')
  .update(secret_iv)
  .digest('hex')
  .substring(0, 16);

const encrypt = (data: string) => {
  const cipher = createCipheriv(encryption_method, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64');
};

const decrypt = (encryptedData: string) => {
  const buff = Buffer.from(encryptedData, 'base64');
  const decipher = createDecipheriv(encryption_method, key, encryptionIV);
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  );
};

export { decrypt, encrypt };

// import CryptoJS from 'crypto-js';

// const secret_key = 'ABC_Elearning1188@';
// const secret_iv = 'ABC_Elearning@8386';
// const encryption_method = 'AES';

// const key = CryptoJS.SHA512(secret_key)
//   .toString(CryptoJS.enc.Hex)
//   .substring(0, 32);
// const encryptionIV = CryptoJS.SHA512(secret_iv)
//   .toString(CryptoJS.enc.Hex)
//   .substring(0, 16);

// /**
//  * Mã hóa dữ liệu sử dụng AES-256-CBC với CryptoJS
//  * @param data Chuỗi cần mã hóa
//  * @returns Chuỗi đã mã hóa (Base64)
//  */
// const encrypt = (data: string): string => {
//   const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
//     iv: CryptoJS.enc.Utf8.parse(encryptionIV),
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   return encrypted.toString();
// };

// /**
//  * Giải mã dữ liệu được mã hóa AES-256-CBC
//  * @param encryptedData Chuỗi đã mã hóa (Base64)
//  * @returns Chuỗi sau khi giải mã
//  */
// const decrypt = (encryptedData: string): string => {
//   const decrypted = CryptoJS.AES.decrypt(
//     encryptedData,
//     CryptoJS.enc.Utf8.parse(key),
//     {
//       iv: CryptoJS.enc.Utf8.parse(encryptionIV),
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     }
//   );

//   return decrypted.toString(CryptoJS.enc.Utf8);
// };

// export { decrypt, encrypt };
