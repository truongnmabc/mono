import path from 'path';
import fs from 'fs';

export const saveJSONFile = (filePath, data) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const appendToEnvFile = (envFilePath, key, value) => {
  fs.appendFileSync(envFilePath, `${key}=${value}\n`);
};
