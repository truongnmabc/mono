import { db } from '@ui/db';

type IPropsLearn = {
  partId?: number;
  slug?: string;
};
export const handleGetDataLean = async ({ partId, slug }: IPropsLearn) => {
  let id = partId || -1;
  let attemptNumber = 1;
  let parentId = -1;
  let index = '';
  if (!partId) {
    const list = await db?.topics
      .where('slug')
      .equals(slug || '')
      .sortBy('index');
    const currentPart = list?.find((item) => item.status === 0);
    if (currentPart) {
      id = currentPart.id;
      attemptNumber = currentPart.turn;
      parentId = currentPart.parentId;
      index = currentPart.index.split('.')[1];
    }
  } else {
    const topics = await db?.topics.get(partId);
    if (topics) {
      id = topics.id;
      attemptNumber = topics.turn;
      parentId = topics.parentId;
      index = topics.index.split('.')[1];
    }
  }

  const listQuestions =
    (await db?.questions.where('partId').equals(id).toArray()) || [];
  return { attemptNumber, listQuestions, id, parentId, index };
};
