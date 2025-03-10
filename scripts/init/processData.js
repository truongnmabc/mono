import { getBranchTest } from './branchTest.js';
import { getDiagnosticTest } from './diagnosticTest.js';
import { listBranchTest } from './processTopicsAndTests.js';
import { processTopic } from './topics.js';
import { generateRandomNegativeId } from './utils.js';

const initDataTopics = async (topics, appShortName) =>
  await Promise.all(topics.map((topic) => processTopic(topic, appShortName)));

const initDataTest = async (tests) => {
  const allTests = Object.values(tests).flat();

  const list = allTests.map((test, index) => ({
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
    createDate: Date.now(),
    index: index,
  }));

  return list;
};

/**
 * 3. Hàm xử lý dữ liệu test
 * - Xử lý dữ liệu finalTests và practiceTests
 * - Lấy thông tin chi tiết của topics (với câu hỏi) qua initDataTopics
 * - Tạo diagnostic test
 */
async function processTestData(topics, tests, appShortName) {
  const listTest = {
    practiceTests: tests.practiceTests,
    finalTests: tests.finalTests?.slice(0, 1),
  };

  const listTests = await initDataTest(listTest);

  const topicsResult = await initDataTopics(topics, appShortName);

  const questions = topicsResult.flatMap((item) => item.questions);
  const listTopics = topicsResult.flatMap((item) => item.topics);
  const diagnosticTest = await getDiagnosticTest(topics, questions);
  const branchTest = [];
  const usedQuestionIds = [];

  for (const _ of listBranchTest) {
    const test = await getBranchTest(topics, questions, usedQuestionIds);
    branchTest.push(test);
    // Thêm các ID câu hỏi đã sử dụng vào danh sách loại trừ
    usedQuestionIds.push(
      ...test.groupExamData.flatMap((group) => group.questionIds)
    );
  }

  const totalQuestion = questions.length;

  const totalLevel = questions.reduce(
    (total, item) => total + (item.level === -1 ? 50 : item.level),
    0
  );

  const passing = {
    id: -1,
    averageLevel: totalLevel / totalQuestion,
    totalQuestion,
  };
  const swTests = [...listTests, diagnosticTest, ...branchTest];

  const authSecret = generateRandomNegativeId();

  return {
    passing,
    questions,
    diagnosticTest,
    branchTest,
    listTopics,
    swTests,
    authSecret,
  };
}

export { processTestData };
