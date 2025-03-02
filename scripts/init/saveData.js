import path from 'path';
import { appendToEnvFile, saveJSONFile } from '../utils/index.js';
import fs from 'fs';

const DATA_PATH = process.cwd();

/**
 * Hàm ghi các biến môi trường vào file .env
 * Nếu file đã tồn tại thì xóa và ghi mới
 */
const appendEnv = (envFilePath, appInfo, isSingle, authSecret) => {
  if (fs.existsSync(envFilePath)) fs.unlinkSync(envFilePath);
  if (isSingle) appendToEnvFile(envFilePath, 'APP_ID', appInfo.appId);
  appendToEnvFile(envFilePath, 'NEXT_PUBLIC_APPLE_ID', 'com.abc.asvabtestweb');
  appendToEnvFile(envFilePath, 'DEV_BASE_API', 'http://localhost:3000/');
  appendToEnvFile(
    envFilePath,
    'NEXT_PUBLIC_SECRET_KEY',
    'https://api.cdl-prep.com/'
  );
  appendToEnvFile(
    envFilePath,
    'NEXT_PUBLIC_WORDPRESS_API_URL',
    'ABCElearning2022'
  );
  appendToEnvFile(
    envFilePath,
    'NEXT_PUBLIC_GOOGLE_ID',
    '792314426707-gp1p1ml492uqehflmnm96r6in0jait6n.apps.googleusercontent.com'
  );
  appendToEnvFile(
    envFilePath,
    'NEXT_PUBLIC_API_URL',
    'https://asvab.cd.worksheetzone.org/'
  );
  if (isSingle) {
    appendToEnvFile(
      envFilePath,
      'NEXT_PUBLIC_APP_SHORT_NAME',
      appInfo.appShortName
    );
  }
  appendToEnvFile(envFilePath, 'AUTH_SECRET', authSecret);
};

/**
 * 7. Hàm cập nhật file môi trường và lưu các file JSON cho app
 */
function updateEnvAndSave({
  config: { appInfo, appConfig },
  sw: { passing, questions, listTopics, swTests },
  seo,
  home,
  authSecret,
}) {
  // config
  const envFilePath = path.join(DATA_PATH, '/apps/single/.env.local');
  appendEnv(envFilePath, appInfo, true, authSecret);
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/appInfos.json'),
    appInfo
  );
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/appConfig.json'),
    appConfig
  );

  // sw =/> passing
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/sw/passing.json'),
    passing
  );

  const chunkSize = 200; // số topic mỗi file
  for (let i = 0; i < questions.length; i += chunkSize) {
    const chunk = questions.slice(i, i + chunkSize);
    saveJSONFile(
      path.join(
        DATA_PATH,
        `/apps/single/src/data/sw/questions_${i / chunkSize}.json`
      ),
      chunk
    );
  }

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/sw/topics.json'),
    listTopics
  );

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/sw/tests.json'),
    swTests
  );
  // seo
  saveJSONFile(path.join(DATA_PATH, '/apps/single/src/data/seo.json'), seo);

  // home
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/home/data.json'),
    home
  );
}

export { updateEnvAndSave };
