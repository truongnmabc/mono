import { db } from '@ui/db';

type IPropsLearn = {
  partId?: number;
  slug?: string;
};

export const handleGetDataLean = async ({ partId, slug }: IPropsLearn) => {
  let id = partId || -1;
  let attemptNumber = 1;
  let subTopicId = -1;
  let index = '1';
  let isCompleted = false;

  // 🔹 1. Lấy danh sách tất cả topics theo slug
  const core = await db?.topics
    .where('slug')
    .equals(slug || '')
    .sortBy('orderIndex');

  if (!core || core.length === 0) {
    return {
      attemptNumber,
      listQuestions: [],
      id,
      subTopicId,
      index,
      currentSubTopicIndex: -1,
      isCompleted,
    };
  }

  let selectedTopic = null;

  // 🔹 2. Nếu có `partId`, tìm topic theo `id`
  if (partId) {
    selectedTopic = core.find((topic) => topic.id === partId);
    if (selectedTopic) {
      id = selectedTopic.id;
      attemptNumber = selectedTopic.turn || 1;
      index = selectedTopic.index || '1';
      subTopicId = selectedTopic.parentId || -1;
      isCompleted = selectedTopic.status === 1;
    }
  } else {
    // 🔹 3. Nếu không có `partId`, tìm topic `type = 2` và `status = 0`
    const firstType2 = core.find(
      (topic) => topic.type === 2 && topic.status === 0
    );

    if (firstType2) {
      id = firstType2.id;
      subTopicId = firstType2.parentId || -1;
      attemptNumber = firstType2.turn || 1;
      index = firstType2.index || '1';

      // 🔹 4. Tìm subtopic đầu tiên có `status = 0` với `parentId` của `type = 2`
      const firstSubTopic = core.find(
        (topic) => topic.parentId === id && topic.status === 0
      );
      if (firstSubTopic) {
        id = firstSubTopic.id;
        attemptNumber = firstSubTopic.turn || 1;
        index = firstSubTopic.index || '1';
        subTopicId = firstSubTopic.parentId || -1;
      }
    } else {
      const list = core.filter((topic) => topic.type === 3);
      const last = list[list.length - 1];
      id = last.id;
      attemptNumber = last.turn || 1;
      index = last.index || '1';
      subTopicId = last.parentId || -1;
    }
  }
  // 🔹 5. Lấy danh sách tất cả part có cùng `parentId`
  const sameParentParts = core.filter((topic) => topic.parentId === subTopicId);

  const currentSubTopicIndex = sameParentParts.findIndex(
    (topic) => topic.id === id
  );

  // 🔹 6. Lấy danh sách câu hỏi
  const listQuestions =
    (await db?.questions.where('partId').equals(id).toArray()) || [];
  return {
    attemptNumber,
    listQuestions,
    id,
    subTopicId,
    index,
    currentSubTopicIndex,
    isCompleted,
  };
};
