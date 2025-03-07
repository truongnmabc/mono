import { createHash, createCipheriv, createDecipheriv } from 'crypto';

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
