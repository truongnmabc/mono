import { db } from '@ui/db';

type IPropsLearn = {
  partId?: number;
  slug?: string;
};
export const handleGetDataLean = async ({ partId, slug }: IPropsLearn) => {
  let id = partId || -1;
  let attemptNumber = 1;
  let subTopicId = -1;
  let index = '';
  let isCompleted = false;
  if (!partId) {
    const core = await db?.topics
      .where('slug')
      .equals(slug || '')
      .sortBy('orderIndex');
    const list = core?.filter((item) => item.type === 3);
    const currentPart = list?.find((item) => item.status === 0);
    if (currentPart) {
      id = currentPart.id;
      attemptNumber = currentPart.turn;
      subTopicId = currentPart.parentId;
      index = currentPart.index;
    } else {
      const endPart = list?.[list.length - 1];
      isCompleted = true;
      id = endPart?.id || -1;
      attemptNumber = endPart?.turn || 1;
      subTopicId = endPart?.parentId || -1;
      index = endPart?.index || '1';
    }
  } else {
    const topics = await db?.topics.get(partId);
    attemptNumber = topics?.turn || 1;
    index = topics?.index || '1';
    if (topics && topics.status === 0) {
      id = topics.id;
      subTopicId = topics.parentId;
    } else if (topics && topics.status === 1) {
      isCompleted = true;
    }
  }

  const currentSubTopicIndex = Number(index.split('.')[1]);

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
