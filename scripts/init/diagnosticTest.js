import {
  generateGroupExamData,
  generateRandomNegativeId,
  getRandomQuestion,
} from './utils.js';

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

export { getDiagnosticTest };
