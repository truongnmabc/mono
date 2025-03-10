import { v4 as uuidv4 } from 'uuid';
export const getRandomQuestion = (questions) => {
  const priorityQuestions = questions?.filter(
    (item) => item.level === -1 || item.level === 50
  );

  return (
    priorityQuestions?.[Math.floor(Math.random() * priorityQuestions.length)] ||
    questions[Math.floor(Math.random() * questions.length)]
  );
};

export const generateGroupExamData = async ({ topics, questions }) => {
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
export function generateRandomNegativeId(exclude = -1) {
  let randomId;
  do {
    // Generate a UUID, hash it, and convert it to a negative number
    randomId = parseInt(uuidv4().replace(/-/g, '').slice(0, 6), 16);
  } while (randomId === exclude);
  return randomId;
}
