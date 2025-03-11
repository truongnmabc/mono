import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@ui/db';
import { IStatusTopic } from '@ui/redux/features/study';

const selectSubTopicThunk = createAsyncThunk(
  'selectSubTopicThunk',
  async (partId: number) => {
    if (partId === -1)
      return {
        list: [],
        subTopicId: partId,
      };
    const data = await db?.topics
      .where('parentId')
      .equals(partId)
      .sortBy('orderIndex');
    if (data) {
      const current = data.find((item) => item.status === 0);
      if (current) {
        const list = data.map((item) => ({
          id: item.id,
          status: (item.status === 1
            ? 'completed'
            : current.id === item.id
            ? 'unlocked'
            : 'locked') as IStatusTopic,
        }));
        return {
          list,
          subTopicId: partId,
        };
      } else {
        return {
          list: data.map((item) => ({
            id: item.id,
            status: 'completed',
          })),
          subTopicId: partId,
        };
      }
    }

    return {
      list: [],
      subTopicId: partId,
    };
  }
);

export default selectSubTopicThunk;
