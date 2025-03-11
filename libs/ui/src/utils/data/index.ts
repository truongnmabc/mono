import { db } from '@ui/db';
import { IQuestionOpt } from '@ui/models';

import { ITopicBase } from '@ui/models';
import { ITopicHomeJson } from '@ui/models/other';

export const fetchQuestionsDb = async ({
  ids,
  key,
}: {
  ids: number[];
  key: 'partId' | 'id';
}): Promise<IQuestionOpt[]> => {
  const allQuestions = await db?.questions?.where(key).anyOf(ids).toArray();
  return allQuestions || [];
};
export const genRandomQuestion = async ({
  value,
  excludeListID = [],
  topics,
  isHard = false,
}: {
  value: number;
  excludeListID?: number[];
  topics: ITopicHomeJson[];
  isHard?: boolean;
}) => {
  const topicsLength = 9;
  const countQuestionTopic = Math.floor(value / topicsLength);
  const remainderQuestionTopic = value % topicsLength;
  const listQuestion = await fetchQuestionsForTopics({
    selectListTopic: topics as ITopicBase[],
    countQuestionTopic,
    remainderQuestionTopic,
    excludeListID: excludeListID,
    target: value,
    isHard,
  });
  return listQuestion;
};
export const fetchQuestionsForTopics = async ({
  selectListTopic,
  countQuestionTopic,
  remainderQuestionTopic,
  excludeListID = [],
  target,
  isHard = false,
}: {
  selectListTopic: ITopicBase[];
  countQuestionTopic: number;
  remainderQuestionTopic: number;
  excludeListID?: number[];
  target: number;
  isHard?: boolean;
}) => {
  const listQuestion: IQuestionOpt[] = [];
  const selectedQuestionIds = new Set<number>();

  const allPartIds = selectListTopic.flatMap((topic) =>
    topic.topics.flatMap((subTopic: ITopicBase) =>
      subTopic.topics.map((part: ITopicBase) => part.id)
    )
  );

  if (!allPartIds.length) return [];

  const ques = await fetchQuestionsDb({
    ids: allPartIds,
    key: 'partId',
  });

  let allQuestions = isHard ? ques.filter((item) => item.level >= 50) : ques;

  if (excludeListID.length) {
    allQuestions = allQuestions?.filter(
      (question) => !excludeListID.includes(question.id)
    );
  }

  const questionMap = new Map<number, IQuestionOpt[]>();

  allQuestions?.forEach((question) => {
    if (!questionMap.has(question.partId)) {
      questionMap.set(question.partId, []);
    }
    questionMap.get(question.partId)!.push(question);
  });

  for (const [topicIndex, topic] of selectListTopic.entries()) {
    const listPart = topic.topics.flatMap(
      (subTopic: ITopicBase) => subTopic.topics as ITopicBase[]
    );
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
          t.topics.some((st: ITopicBase) =>
            st.topics.some((p: ITopicBase) => p.id === item.partId)
          )
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

export const generateGroupExamData = async ({
  topics,
  questions,
}: {
  topics: ITopicBase[];
  questions: IQuestionOpt[];
}) => {
  return topics.map((topic) => {
    // Lấy danh sách các subtopic thuộc topic hiện tại
    const subtopicIds = topic.topics.map((subtopic: ITopicBase) => subtopic.id);

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
