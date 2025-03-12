import { spinner } from '@clack/prompts';

import minimist from 'minimist';
import {
  getDataMember,
  getDataSingleApp,
  getDataTopicsAndTest,
  getSingleAppConfig,
} from '../utils/fetchData.js';
import { processTestData } from './processData.js';
import { processDataHome } from './processDataHome.js';
import { processSeoData } from './processSeoData.js';
import {
  listBranchTest,
  processTopicsAndTests,
} from './processTopicsAndTests.js';
import { updateEnvAndSave } from './saveData.js';

/**
 * 1. Hàm fetch dữ liệu cần thiết cho app
 * Lấy thông tin app, config, topics & tests và SEO cùng lúc
 */
async function fetchAppData(appShortName) {
  const [appInfoCore, appConfig, topicsAndTest, member] = await Promise.all([
    getDataSingleApp(appShortName),
    getSingleAppConfig(appShortName),
    getDataTopicsAndTest(appShortName),
    getDataMember(),
  ]);
  return { appInfoCore, appConfig, topicsAndTest, member };
}

/**
 * 6. Hàm xử lý thông tin app
 * - Chuyển đổi các thuộc tính JSON string sang object
 */
function processAppInfo(appInfoCore) {
  return appInfoCore.map((item) => ({
    ...item,
    totalQuestion: Number(item.totalQuestion),
    oneWeekPro: JSON.parse(item.oneWeekPro),
    oneMonthPro: JSON.parse(item.oneMonthPro),
    oneYearPro: JSON.parse(item.oneYearPro),
  }));
}

/**
 * Hàm setup cho single app
 * Chia thành các bước rõ ràng:
 * 1. Fetch dữ liệu cho app
 * 2. Xử lý dữ liệu topics và tests
 * 3. Xử lý dữ liệu test (bao gồm diagnostic test, brach test)
 * 4. Lưu các file JSON liên quan đến test
 * 5. Xử lý dữ liệu SEO
 * 6. Xử lý thông tin app
 * 7. Cập nhật file môi trường và lưu các file JSON của app
 * 8. Thực hiện lệnh xác thực
 */

async function setupSingleApp(appShortName, isProp) {
  const s = spinner();
  try {
    s.start('Fetching data...');
    const { appInfoCore, appConfig, topicsAndTest, member } =
      await fetchAppData(appShortName);
    s.stop('Fetching data completed!');

    s.start('Processing topics and tests...');
    const { topics, tests, slugs } = processTopicsAndTests(
      topicsAndTest,
      appShortName
    );
    s.stop('Processing topics and tests completed!');

    s.start('Processing test data...');
    const {
      questions,
      passing,
      diagnosticTest,
      branchTest,
      listTopics,
      swTests,
      authSecret,
    } = await processTestData(topics, tests, appShortName);
    s.stop('Processing test data completed!');

    s.start('Processing seo data...');
    const listSeo = await processSeoData(slugs);
    s.stop('Processing seo data completed!');

    s.start('Processing app info...');
    const appInfo = processAppInfo(appInfoCore);
    s.stop('Processing app info completed!');

    s.start('Processing home data...');
    const dataHome = processDataHome({
      seo: listSeo.default.home,
      topics,
      diagnosticTestId: diagnosticTest.id,
      branchTest: Object.keys(listSeo.rewrite.branch).map((item, index) => ({
        id: branchTest[index].id,
        name: listBranchTest[index].title,
        slug: item,
      })),
      practiceTests: topicsAndTest.tests.practiceTests,
      finalTestsId: topicsAndTest.tests.finalTests[0].id,
      appShortName,
    });
    s.stop('Processing home data completed!');

    s.start('Updating env and saving data...');
    updateEnvAndSave({
      config: {
        appInfo: appInfo[0],
        appConfig: appConfig[0],
      },
      sw: {
        passing: passing,
        questions: questions,
        listTopics: listTopics,
        swTests: swTests,
      },
      seo: listSeo,
      home: dataHome,
      authSecret,
      server: {
        diagnosticTest: diagnosticTest,
      },
      appShortName,
      member,
      isProp,
    });
    s.stop('Updating env and saving data completed!');

    s.stop('Setup single app completed!');
    process.exit(0);
  } catch (error) {
    console.log('🚀 ~ setupSingleApp ~ error:', error);
    s.error('Có lỗi xảy ra: ' + error.message);
    throw error;
  }
}

// Xử lý các đối số từ dòng lệnh sử dụng minimist
const args = minimist(process.argv.slice(2));
const appShortName = args._[0]; // Ví dụ: 'asvab'
const isStateFlag = args.s;
const isDynamicFlag = args.d;
const isHelperFlag = args.h;
const isProp = args.p;

const showHelper = () => {
  console.log(`
        Usage: pnpm run init <appShortName> [options]

        Options:
          -s       Setup state app.
          -d       Setup dynamic app.

        Examples:
          pnpm run init my-app-id         # Setup single app với appShortName 'my-app-id'
          pnpm run init my-app-id -s      # Setup state app với appShortName 'my-app-id'
          pnpm run init -d                # Setup dynamic app
    `);
};

if ((!appShortName && !isDynamicFlag) || isHelperFlag) {
  showHelper();
  process.exit(1);
}

if (isDynamicFlag) {
  console.log('Khởi tạo dynamic app');
} else if (isStateFlag) {
  console.log('Khởi tạo state app với appShortName:', appShortName);
} else {
  setupSingleApp(appShortName, isProp);
}
