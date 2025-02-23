import minimist from 'minimist';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { exec } from 'child_process';
import { spinner } from '@clack/prompts';

import {
  getDataSeo,
  getDataSingleApp,
  getSingleAppConfig,
  getDataTopicsAndTest,
  getQuestionByTopics,
} from '../utils/fetchData.js';
import { saveJSONFile, appendToEnvFile } from '../utils/index.js';

const DATA_PATH = process.cwd();

/**
 * Hàm thực hiện lệnh xác thực
 */
const getAuth = () => {
  exec('npx auth secret');
};

/**
 * Hàm ghi các biến môi trường vào file .env
 * Nếu file đã tồn tại thì xóa và ghi mới
 */
const appendEnv = (envFilePath, appInfo, isSingle) => {
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
};

/**
 * 1. Hàm fetch dữ liệu cần thiết cho app
 * Lấy thông tin app, config, topics & tests và SEO cùng lúc
 */
async function fetchAppData(appShortName) {
  const [appInfoCore, appConfig, topicsAndTest, seo] = await Promise.all([
    getDataSingleApp(appShortName),
    getSingleAppConfig(appShortName),
    getDataTopicsAndTest(appShortName),
    getDataSeo(appShortName),
  ]);
  return { appInfoCore, appConfig, topicsAndTest, seo };
}

/**
 * 2. Hàm xử lý dữ liệu topics và tests
 * - Tách riêng topics và tests từ topicsAndTest
 * - Tạo slug cho mỗi topic để phục vụ SEO
 */
function processTopicsAndTests(topicsAndTest, appShortName) {
  const topics = topicsAndTest.topic;
  const tests = topicsAndTest.tests;
  const slugs = topics.map((topic) => ({
    slug: `${appShortName}-${topic.tag}-practice-test`,
    tag: topic.tag,
  }));
  return { topics, tests, slugs };
}

/**
 * 3. Hàm xử lý dữ liệu test
 * - Xử lý dữ liệu finalTests và practiceTests
 * - Lấy thông tin chi tiết của topics (với câu hỏi) qua initDataTopics
 * - Tạo diagnostic test
 */
async function processTestData(topics, tests) {
  const listTest = {
    finalTests: tests.finalTests?.slice(0, 1),
    practiceTests: tests.practiceTests,
  };
  const listTests = await initDataTest(listTest);
  const topicsResult = await initDataTopics(topics);
  const listT = topicsResult.map((item) => item.topics);
  const listQ = topicsResult.flatMap((item) => item.questions);
  const diagnosticTest = await getDiagnosticTest(topics, listQ);
  return { listTests, listT, listQ, diagnosticTest };
}

/**
 * 4. Hàm lưu các file JSON liên quan đến dữ liệu test
 */
function saveTestData(listTests, diagnosticTest, listT, listQ) {
  const dataTest = [...listTests, diagnosticTest];
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/tests.json'),
    dataTest
  );

  // Tính tổng level và số câu hỏi để tính điểm passing
  const totalLevel = listQ.reduce(
    (total, item) => total + (item.level === -1 ? 50 : item.level),
    0
  );
  const totalQuestion = listQ.length;

  const passing = {
    id: -1,
    averageLevel: totalLevel / totalQuestion,
    totalQuestion,
  };

  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/topics.json'),
    listT
  );
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/passing.json'),
    passing
  );

  const chunkSize = 200; // số topic mỗi file
  for (let i = 0; i < listQ.length; i += chunkSize) {
    const chunk = listQ.slice(i, i + chunkSize);
    // Lưu mỗi chunk vào một file riêng, ví dụ: topics_0.json, topics_1.json, ...
    saveJSONFile(
      path.join(
        DATA_PATH,
        `/apps/single/src/data/questions_${i / chunkSize}.json`
      ),
      chunk
    );
  }
}

/**
 * 5. Hàm xử lý dữ liệu SEO
 * - Lấy dữ liệu SEO cho từng slug và chuyển thành object với key là tag
 * - Gộp thêm dữ liệu SEO mặc định cho các trang khác nếu không có dữ liệu
 */
async function processSeoData(slugs, defaultSeo) {
  const dataSeo = await Promise.all(
    slugs.map(async (item) => {
      const data = await getDataSeo(item.slug);
      return { tag: item.tag, data };
    })
  );
  const seoByTag = dataSeo.reduce((result, item) => {
    result[item.tag] = {
      content: item?.data?.content,
      titleSeo: item?.data?.titleSeo[0],
      descSeo: item?.data?.descSeo[0],
    };
    return result;
  }, {});
  const seoNull = {
    content: '',
    titleSeo: '',
    descSeo: '',
  };
  return {
    ...seoByTag,
    home: defaultSeo,
    practiceTest: seoNull,
    finalTest: seoNull,
    diagnosticTest: seoNull,
    customTest: seoNull,
    review: seoNull,
  };
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
 * 7. Hàm cập nhật file môi trường và lưu các file JSON cho app
 */
function updateEnvAndSave(appInfo, appConfig, topicsAndTest, listSeo) {
  const envFilePath = path.join(DATA_PATH, '/apps/single/.env.local');
  appendEnv(envFilePath, appInfo, true);
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/appInfos.json'),
    appInfo
  );
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/appConfig.json'),
    appConfig
  );
  saveJSONFile(
    path.join(DATA_PATH, '/apps/single/src/data/topicsAndTest.json'),
    topicsAndTest
  );
  saveJSONFile(path.join(DATA_PATH, '/apps/single/src/data/seo.json'), listSeo);
}

const initDataTopics = async (topics) =>
  await Promise.all(topics.map((topic) => processTopic(topic)));

const initDataTest = async (tests) => {
  const allTests = Object.values(tests).flat();

  const list = allTests.map((test) => ({
    id: test.id,
    totalDuration: test.duration,
    totalQuestion: test.totalQuestion,
    startTime: 0,
    gameMode: tests.finalTests.includes(test) ? 'finalTests' : 'practiceTests',
    status: 0,
    elapsedTime: 0,
    attemptNumber: 1,
    topicIds: test.topicIds,
    passingThreshold: test.passingPercent,
    groupExamData: test.groupExamData.flatMap((g) => g.examData),
    isGamePaused: false,
    createData: Date.now(),
  }));

  return list;
};
const getDiagnosticTest = async (topics, allQuestions) => {
  const listSubTopic = topics.flatMap((topic) => topic.topics);
  const listQuestion = [];
  for (const subtopic of listSubTopic) {
    const questions = allQuestions.filter((q) => q.subTopicId === subtopic.id);
    if (!questions.length) continue;

    const randomItem = getRandomQuestion(questions);
    if (randomItem) {
      listQuestion.push(randomItem);
    }
  }
  const groupExamData = await generateGroupExamData({
    topics,
    questions: listQuestion,
  });
  const id = generateRandomNegativeId();
  return {
    id: id,
    totalDuration: 1,
    isGamePaused: false,
    startTime: Date.now(),
    remainingTime: 80,
    gameMode: 'diagnosticTest',
    status: 0,
    attemptNumber: 1,
    elapsedTime: 0,
    topicIds: topics.map((item) => item.id),
    groupExamData: groupExamData,
    passingThreshold: 0,
    totalQuestion: listQuestion.length,
  };
};
const buildTopicData = (topic, data) => {
  return {
    id: Number(topic.id),
    icon: topic.icon,
    tag: topic.tag,
    contentType: topic.contentType,
    name: topic.name,
    parentId: topic.parentId,
    topics: mapTopics(topic.topics, data),
    slug: `${topic.tag}-practice-test`,
    totalQuestion: calculateTotalQuestionsTopic(data),
    averageLevel: calculateAverageLevelTopic(data),
    status: 0,
    turn: 1,
  };
};
const calculateTotalQuestionsTopic = (data) => {
  return data.reduce((total, topic) => {
    return (
      total +
      (topic.topics?.reduce(
        (sum, part) => sum + (part.questions?.length ?? 0),
        0
      ) || 0)
    );
  }, 0);
};
const calculateAverageLevelTopic = (data) => {
  let totalLevel = 0;
  let totalQuestions = 0;

  for (const topic of data) {
    for (const part of topic.topics || []) {
      for (const question of part.questions || []) {
        totalLevel += question.level === -1 ? 50 : question.level;
        totalQuestions += 1;
      }
    }
  }

  return totalQuestions > 0 ? totalLevel / totalQuestions : 0;
};
const extractAllQuestions = (data, topic) => {
  return data.flatMap((t) => {
    const subTopicTag = t.tag;
    return (
      t.topics.flatMap((part) =>
        part.questions.map((item) => ({
          icon: topic.icon,
          tag: topic.tag,
          subTopicTag,
          status: 0,
          appId: item.appId,
          partId: part.id,
          subTopicId: part.parentId,
          topicId: t.parentId,
          explanation: item.explanation,
          id: item.id,
          image: item.image,
          level: item.level,
          paragraphId: item.paragraphId,
          paragraph: {
            id: item?.paragraph?.id,
            text: item?.paragraph?.text,
          },
          text: item.text,
          answers: item.answers,
        }))
      ) || []
    );
  });
};
const mapSubTopics = (topics = [], data) =>
  topics.map(({ id, icon, tag, contentType, name, parentId }) => {
    const subTopicData = data.find((t) => Number(t.id) === id);
    const total = subTopicData?.questions?.length || 0;
    return {
      id: Number(id),
      icon,
      tag,
      contentType,
      name,
      parentId,
      slug: `${tag}-practice-test`,
      topics: [],
      status: 0,
      turn: 1,
      totalQuestion: total,
      averageLevel:
        (subTopicData?.questions?.reduce(
          (sum, part) => sum + (part.level === -1 ? 50 : part.level),
          0
        ) || 0) / total,
    };
  });
const mapTopics = (topics = [], data) =>
  topics.map(({ id, icon, tag, contentType, name, parentId, topics }) => {
    const topicData = data.find((t) => Number(t.id) === id);
    const total = calculateSubTopicTotalQuestions(topicData.topics);
    const averageLevel = calculateAverageLevel(topicData.topics);
    return {
      id: Number(id),
      icon,
      tag,
      contentType,
      name,
      parentId,
      slug: `${tag}-practice-test`,
      topics: mapSubTopics(topics, topicData.topics),
      totalQuestion: total,
      averageLevel: averageLevel / total,
      status: 0,
      turn: 1,
    };
  });
const calculateSubTopicTotalQuestions = (data) => {
  return (
    data?.reduce((sum, part) => sum + (part.questions?.length ?? 0), 0) || 0
  );
};
const calculateAverageLevel = (data) => {
  return data.reduce((total, topic) => {
    return (
      total +
      (topic.questions?.reduce(
        (sum, part) => sum + (part.level === -1 ? 50 : part.level),
        0
      ) || 0)
    );
  }, 0);
};
const processTopic = async (topic) => {
  const data = await getQuestionByTopics(topic.id);

  const topicData = buildTopicData(topic, data);
  const allQuestions = extractAllQuestions(data, topic);
  return {
    topics: topicData,
    questions: allQuestions,
  };
};

const generateGroupExamData = async ({ topics, questions }) => {
  return topics.map((topic) => {
    // Lấy danh sách các subtopic thuộc topic hiện tại
    const subtopicIds = topic.topics.map((subtopic) => subtopic.id);

    // Lọc ra danh sách câu hỏi thuộc các subtopic này
    const questionIds = questions
      .filter((question) => subtopicIds.includes(question.subTopicId))
      .map((question) => question.id);

    return {
      topicName: topic.name,
      passingPercent: 0,
      totalQuestion: questionIds.length,
      questionIds,
      topicId: topic.id,
    };
  });
};

function generateRandomNegativeId(exclude = -1) {
  let randomId;
  do {
    // Generate a UUID, hash it, and convert it to a negative number
    randomId = -parseInt(uuidv4().replace(/-/g, '').slice(0, 6), 16);
  } while (randomId === exclude);
  return randomId;
}

const getRandomQuestion = (questions) => {
  const priorityQuestions = questions?.filter(
    (item) => item.level === -1 || item.level === 50
  );

  return (
    priorityQuestions?.[Math.floor(Math.random() * priorityQuestions.length)] ||
    questions[Math.floor(Math.random() * questions.length)]
  );
};
/* 
  Lưu ý: 
  - Các hàm hỗ trợ khác như initDataTopics, initDataTest, getDiagnosticTest, 
    buildTopicData, calculateTotalQuestionsTopic, calculateAverageLevelTopic, 
    extractAllQuestions, mapSubTopics, mapTopics, calculateSubTopicTotalQuestions, 
    calculateAverageLevel, processTopic, generateGroupExamData, generateRandomNegativeId, 
    getRandomQuestion ... giữ nguyên phần định nghĩa như cũ.
*/

/**
 * Hàm setup cho single app
 * Chia thành các bước rõ ràng:
 * 1. Fetch dữ liệu cho app
 * 2. Xử lý dữ liệu topics và tests
 * 3. Xử lý dữ liệu test (bao gồm diagnostic test)
 * 4. Lưu các file JSON liên quan đến test
 * 5. Xử lý dữ liệu SEO
 * 6. Xử lý thông tin app
 * 7. Cập nhật file môi trường và lưu các file JSON của app
 * 8. Thực hiện lệnh xác thực
 */

async function setupSingleApp(appShortName) {
  const s = spinner();
  try {
    // Bước 1: Lấy dữ liệu ứng dụng
    s.start('Bước 1: Lấy dữ liệu ứng dụng...');
    const { appInfoCore, appConfig, topicsAndTest, seo } = await fetchAppData(
      appShortName
    );
    s.stop('Đã lấy dữ liệu ứng dụng.');

    // Bước 2: Xử lý dữ liệu topics và tests
    s.start('Bước 2: Xử lý dữ liệu topics và tests...');
    const { topics, tests, slugs } = processTopicsAndTests(
      topicsAndTest,
      appShortName
    );
    s.stop('Đã xử lý topics và tests.');

    // Bước 3: Xử lý dữ liệu test và tạo diagnostic test
    s.start('Bước 3: Xử lý dữ liệu test và tạo diagnostic test...');
    const { listTests, listT, listQ, diagnosticTest } = await processTestData(
      topics,
      tests
    );
    s.stop('Đã xử lý dữ liệu test.');

    // Bước 4: Lưu file dữ liệu test
    s.start('Bước 4: Lưu file dữ liệu test...');
    saveTestData(listTests, diagnosticTest, listT, listQ);
    s.stop('Đã lưu file dữ liệu test.');

    // Bước 5: Xử lý dữ liệu SEO
    s.start('Bước 5: Xử lý dữ liệu SEO...');
    const listSeo = await processSeoData(slugs, seo);
    s.stop('Đã xử lý dữ liệu SEO.');

    // Bước 6: Xử lý thông tin ứng dụng
    s.start('Bước 6: Xử lý thông tin ứng dụng...');
    const appInfo = processAppInfo(appInfoCore);
    s.stop('Đã xử lý thông tin ứng dụng.');

    // Bước 7: Cập nhật file môi trường và lưu dữ liệu ứng dụng
    s.start('Bước 7: Cập nhật file môi trường và lưu dữ liệu ứng dụng...');

    const listTopicsAndTest = {
      topics: topicsAndTest.topic.map((topic) => ({
        ...topic,
        slug: `${topic.tag}-practice-test`,
        id: Number(topic.id),
        topics: topic.topics?.map((item) => ({
          ...item,
          slug: `${item.tag}-practice-test`,
          topics: item.topics?.filter((subItem) => subItem.contentType === 0),
        })),
      })),
      tests: topicsAndTest.tests?.practiceTests,
    };

    updateEnvAndSave(appInfo[0], appConfig[0], listTopicsAndTest, listSeo);
    s.stop('Đã cập nhật file môi trường và lưu dữ liệu.');

    // Bước 8: Xác thực ứng dụng
    s.start('Bước 8: Xác thực ứng dụng...');
    getAuth();
    s.stop('Đã xác thực ứng dụng.');

    s.stop('Setup single app hoàn thành!');
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
  // Xử lý setup dynamic app
  console.log('Khởi tạo dynamic app');
} else if (isStateFlag) {
  // Xử lý setup state app
  console.log('Khởi tạo state app với appShortName:', appShortName);
} else {
  // Mặc định là setup single app
  setupSingleApp(appShortName);
}
