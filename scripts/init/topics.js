import { getQuestionByTopics } from '../utils/fetchData.js';

export const processTopic = async (topic, appShortName) => {
  const data = await getQuestionByTopics(topic.id);
  const topicData = buildTopicData(topic, data, appShortName);
  const allQuestions = extractAllQuestions(data, topic);
  return {
    topics: topicData,
    questions: allQuestions,
  };
};

const buildTopicData = (topic, data, appShortName) => {
  const slug = `${appShortName}-${topic.tag}-practice-test`;
  const totalQuestion = calculateTotalQuestionsTopic(data);
  const averageLevel = calculateAverageLevelTopic(data);
  const subTopics = mapTopics(topic.topics, data, slug, topic.icon);
  const mainTopic = {
    id: Number(topic.id),
    icon: topic.icon,
    tag: topic.tag,
    contentType: topic.contentType,
    name: topic.name,
    parentId: topic.parentId,
    topics: [],
    slug: slug,
    totalQuestion: totalQuestion,
    averageLevel: averageLevel,
    status: 0,
    turn: 1,
    // 1:topics, 2: sub topic, 3 core
    type: 1,
    // 0: Chưa sync, 1: Đã sync
    isSynced: false,
    orderIndex: topic.orderIndex,
  };
  return [mainTopic, ...subTopics.flat()];
};

const mapTopics = (topics = [], data, slug, icon) =>
  topics.flatMap(
    ({ id, tag, contentType, name, parentId, topics, orderIndex }, index) => {
      const topicData = data.find((t) => Number(t.id) === id);
      if (!topicData) return []; // Nếu không có dữ liệu, trả về mảng rỗng

      const total = calculateSubTopicTotalQuestions(topicData.topics);
      const averageLevel = calculateAverageLevel(topicData.topics);
      const coreTopics = mapSubTopics(
        topics,
        topicData.topics,
        slug,
        index + 1,
        icon
      );

      const subTopic = {
        id: Number(id),
        icon,
        tag,
        contentType,
        name,
        parentId,
        slug,
        topics: [],
        totalQuestion: total,
        averageLevel: total > 0 ? averageLevel / total : 0,
        status: 0,
        turn: 1,
        index: `${index + 1}.0`,
        type: 2,
        orderIndex: orderIndex,
        isSynced: false,
      };

      // Trả về cả subTopic và coreTopics
      return [subTopic, ...coreTopics];
    }
  );

const mapSubTopics = (topics = [], data, slug, startIndex, icon) =>
  topics.map(({ id, tag, contentType, name, parentId, orderIndex }, index) => {
    const subTopicData = data.find((t) => Number(t.id) === id) || {};
    const total = subTopicData?.questions?.length || 0;
    const averageLevel =
      total > 0
        ? subTopicData?.questions?.reduce(
            (sum, part) => sum + (part.level === -1 ? 50 : part.level),
            0
          ) / total
        : 0;

    return {
      id: Number(id),
      icon,
      tag,
      contentType,
      name,
      parentId,
      slug,
      topics: [],
      status: 0,
      turn: 1,
      totalQuestion: total,
      averageLevel,
      index: `${startIndex}.${index}`,
      type: 3,
      orderIndex,
      isSynced: false,
    };
  });

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
