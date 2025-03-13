import CryptoJS from 'crypto-js';

const secret_key = 'ABC_Elearning1188@';
const secret_iv = 'ABC_Elearning@8386';

const key = CryptoJS.SHA512(secret_key)
  .toString(CryptoJS.enc.Hex)
  .substring(0, 32);
const encryptionIV = CryptoJS.SHA512(secret_iv)
  .toString(CryptoJS.enc.Hex)
  .substring(0, 16);

const encrypt = (data: string) => {
  try {
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(encryptionIV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return cipher.toString();
  } catch (err) {
    console.log('🚀 ~ encrypt ~ err:', err);
    return data;
  }
};

const decrypt = (encryptedData: string) => {
  try {
    const decipher = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: CryptoJS.enc.Utf8.parse(encryptionIV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decipher.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.log('🚀 ~ decrypt ~ err:', err);
    return encryptedData;
  }
};

export { decrypt, encrypt };
