import fs from 'fs';
import path from 'path';
import { appendToEnvFile, saveJSONFile } from '../utils/index.js';

const DATA_PATH = process.cwd();
const SINGLE_APP_PATH = path.join(DATA_PATH, '/apps/single');
/**
 * Hàm ghi các biến môi trường vào file .env
 * Nếu file đã tồn tại thì xóa và ghi mới
 */
const appendEnv = (envFilePath, appInfo, isSingle, authSecret, isProp) => {
  if (fs.existsSync(envFilePath)) fs.unlinkSync(envFilePath);
  if (isSingle) appendToEnvFile(envFilePath, 'APP_ID', appInfo.appId);

  const url = isProp ? 'https://asvab-prep.com/' : 'http://localhost:3000/';

  appendToEnvFile(envFilePath, 'NEXT_PUBLIC_APPLE_ID', 'com.abc.asvabtestweb');
  appendToEnvFile(envFilePath, 'DEV_BASE_API', url);
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
  appendToEnvFile(envFilePath, 'NEXT_PUBLIC_API_URL', url);
  if (isSingle) {
    appendToEnvFile(
      envFilePath,
      'NEXT_PUBLIC_APP_SHORT_NAME',
      appInfo.appShortName
    );
  }
  appendToEnvFile(envFilePath, 'AUTH_SECRET', authSecret);
  appendToEnvFile(envFilePath, 'AUTH_TRUST_HOST', url);
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
  server: { diagnosticTest },
  appShortName,
  member,
  isProp,
}) {
  // config
  const envFilePath = path.join(DATA_PATH, '/apps/single/.env.local');
  appendEnv(envFilePath, appInfo, true, authSecret, isProp);

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
  // server

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/final.json'),
    {
      titleSeo:
        seo.rewrite[`full-length-${appShortName}-practice-test`].titleSeo,
      descSeo: seo.rewrite[`full-length-${appShortName}-practice-test`].descSeo,
      content: seo.rewrite[`full-length-${appShortName}-practice-test`].content,
    }
  );

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/diagnostic.json'),
    seo.diagnostic
  );
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/custom.json'),
    seo.custom
  );

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/review.json'),
    seo.review
  );

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/contact.json'),
    seo.contact
  );

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/about.json'),
    {
      ...seo.about,
      listMember: member,
    }
  );

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/billing.json'),
    seo.billing
  );

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/finish.json'),
    seo.finish
  );
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/getPro.json'),
    seo.getPro
  );

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/server/result.json'),
    seo.result
  );
}

export { updateEnvAndSave };
