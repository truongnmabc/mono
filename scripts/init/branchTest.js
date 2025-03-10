import { generateGroupExamData, generateRandomNegativeId } from './utils.js';

const totalQuestionBrachTest = 135;
const totalDurationBrachTest = 135;

export async function getBranchTest(topics, listQ, excludedQuestions = []) {
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
