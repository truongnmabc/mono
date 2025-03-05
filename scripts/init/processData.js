import { v4 as uuidv4 } from 'uuid';

import { getQuestionByTopics } from '../utils/fetchData.js';
import { listBranchTest } from './processTopicsAndTests.js';

const totalQuestionBrachTest = 135;
const totalDurationBrachTest = 135;

const initDataTopics = async (topics, appShortName) =>
  await Promise.all(topics.map((topic) => processTopic(topic, appShortName)));

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

const buildTopicData = (topic, data, appShortName) => {
  const slug = `${appShortName}-${topic.tag}-practice-test`;
  return {
    id: Number(topic.id),
    icon: topic.icon,
    tag: topic.tag,
    contentType: topic.contentType,
    name: topic.name,
    parentId: topic.parentId,
    topics: mapTopics(topic.topics, data, slug),
    slug: slug,
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

const fetchQuestionsForTopics = async ({
  selectListTopic,
  countQuestionTopic,
  remainderQuestionTopic,
  excludeListID = [],
  target,
  questions,
}) => {
  const listQuestion = [];
  const selectedQuestionIds = new Set();

  const allPartIds = selectListTopic.flatMap((topic) =>
    topic.topics.flatMap((subTopic) => subTopic.topics.map((part) => part.id))
  );

  if (!allPartIds.length) return [];

  let allQuestions = questions;

  if (excludeListID.length) {
    allQuestions = allQuestions?.filter(
      (question) => !excludeListID.includes(question.id)
    );
  }

  const questionMap = new Map();

  allQuestions?.forEach((question) => {
    if (!questionMap.has(question.partId)) {
      questionMap.set(question.partId, []);
    }
    questionMap.get(question.partId)?.push(question);
  });

  for (const [topicIndex, topic] of selectListTopic.entries()) {
    const listPart = topic.topics.flatMap((subTopic) => subTopic.topics);
    if (!listPart.length) continue;

    const countQuestionPart = Math.floor(countQuestionTopic / listPart.length);
    const remainderQuestionPart = countQuestionTopic % listPart.length;

    for (const [partIndex, part] of listPart.entries()) {
      const topicData = questionMap.get(part.id) || [];
      if (!topicData.length) continue;

      const questionCount =
        partIndex === listPart.length - 1
          ? countQuestionPart + remainderQuestionPart
          : countQuestionPart;

      const randomQuestions = topicData
        .sort(() => Math.random() - 0.5)
        .filter((item) => !selectedQuestionIds.has(item.id))
        .slice(0, questionCount)
        .map((item) => {
          selectedQuestionIds.add(item.id);
          return {
            ...item,
            tag: topic.tag,
            icon: topic.icon,
            parentId: topic.id,
          };
        });

      listQuestion.push(...randomQuestions);
    }

    if (
      topicIndex === selectListTopic.length - 1 &&
      remainderQuestionTopic > 0
    ) {
      const lastParts = listPart.slice(-5).map((part) => part.id);

      const extraQuestions = lastParts
        .flatMap((partId) => questionMap.get(partId) || [])
        .sort(() => Math.random() - 0.5)
        .filter((item) => !selectedQuestionIds.has(item.id))
        .slice(0, remainderQuestionTopic)
        .map((item) => {
          selectedQuestionIds.add(item.id);
          return {
            ...item,
            tag: topic.tag,
            icon: topic.icon,
            parentId: topic.id,
          };
        });

      listQuestion.push(...extraQuestions);
    }
  }

  if (listQuestion.length < target) {
    const remainingCount = target - listQuestion.length;

    // Get all available questions that haven't been selected yet
    const remainingQuestions = allQuestions
      .filter((question) => !selectedQuestionIds.has(question.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, remainingCount)
      .map((item) => {
        const topic = selectListTopic.find((t) =>
          t.topics.some((st) => st.topics.some((p) => p.id === item.partId))
        );
        return {
          ...item,
          tag: topic?.tag || '',
          icon: topic?.icon || '',
          parentId: topic?.id || 0,
        };
      });

    listQuestion.push(...remainingQuestions);
  }

  return listQuestion;
};

async function getBranchTest(topics, listQ, excludedQuestions = []) {
  const countQuestionTopic = Math.floor(totalQuestionBrachTest / topics.length);
  const remainderQuestionTopic = totalQuestionBrachTest % topics.length;
  const id = generateRandomNegativeId();

  const listQuestion = await fetchQuestionsForTopics({
    selectListTopic: topics,
    countQuestionTopic,
    remainderQuestionTopic,
    excludeListID: excludedQuestions,
    target: totalQuestionBrachTest,
    questions: listQ,
  });
  const groupExamData = await generateGroupExamData({
    questions: listQuestion,
    topics: topics,
  });
  return {
    totalDuration: totalDurationBrachTest,
    passingThreshold: 70,
    isGamePaused: false,
    id: id,
    startTime: Date.now(),
    gameMode: 'branchTest',
    gameDifficultyLevel: 'newbie',
    topicIds: topics.map((item) => item.id),
    status: 0,
    attemptNumber: 1,
    elapsedTime: 0,
    totalQuestion: totalQuestionBrachTest,
    groupExamData: groupExamData,
    createDate: Date.now(), // Giữ nguyên createData khi update
  };
}

const mapSubTopics = (topics = [], data, slug, startIndex) =>
  topics.map(({ id, icon, tag, contentType, name, parentId }, index) => {
    const subTopicData = data.find((t) => Number(t.id) === id);
    const total = subTopicData?.questions?.length || 0;
    return {
      id: Number(id),
      icon,
      tag,
      contentType,
      name,
      parentId,
      slug: slug,
      topics: [],
      status: 0,
      turn: 1,
      totalQuestion: total,
      averageLevel:
        (subTopicData?.questions?.reduce(
          (sum, part) => sum + (part.level === -1 ? 50 : part.level),
          0
        ) || 0) / total,
      index: `${startIndex}.${index}`,
    };
  });

const mapTopics = (topics = [], data, slug) =>
  topics.map(
    ({ id, icon, tag, contentType, name, parentId, topics }, index) => {
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
        slug: slug,
        topics: mapSubTopics(topics, topicData.topics, slug, index + 1),
        totalQuestion: total,
        averageLevel: averageLevel / total,
        status: 0,
        turn: 1,
        index: `${index + 1}.0`,
      };
    }
  );

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

const processTopic = async (topic, appShortName) => {
  const data = await getQuestionByTopics(topic.id);
  const topicData = buildTopicData(topic, data, appShortName);
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
/**
 * 3. Hàm xử lý dữ liệu test
 * - Xử lý dữ liệu finalTests và practiceTests
 * - Lấy thông tin chi tiết của topics (với câu hỏi) qua initDataTopics
 * - Tạo diagnostic test
 */
async function processTestData(topics, tests, appShortName) {
  const listTest = {
    finalTests: tests.finalTests?.slice(0, 1),
    practiceTests: tests.practiceTests,
  };

  const listTests = await initDataTest(listTest);

  const topicsResult = await initDataTopics(topics, appShortName);

  const list = topicsResult.flatMap((item) => item.topics);
  const listSubTopic = list.flatMap((item) => item.topics);
  const listPart = listSubTopic.flatMap((item) => item.topics);
  const listSubMap = listSubTopic.map((item) => ({
    ...item,
    topics: [],
    slug: '',
  }));
  const listTopics = [...listPart, ...listSubMap];
  const questions = topicsResult.flatMap((item) => item.questions);

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

export { generateRandomNegativeId, processTestData };
