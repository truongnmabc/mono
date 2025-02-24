import { db } from '@ui/db';
import { createAsyncThunk } from '@reduxjs/toolkit';

type IInitQuestion = {
  subTopicProgressId: number;
  topicId: number;
};

const finishQuestionThunk = createAsyncThunk(
  'finishQuestionThunk',
  async ({ subTopicProgressId, topicId }: IInitQuestion) => {
    try {
      const currentProgress = await db?.topics
        .filter((topic) =>
          topic.topics.some((subTopic) => subTopic.id === subTopicProgressId)
        )
        .first();

      if (!currentProgress) throw new Error('Progress not found');

      await db?.topics
        .where('id')
        .equals(currentProgress.id)
        .modify((topic) => {
          topic.topics.forEach((subTopic) => {
            if (subTopic.id === subTopicProgressId) {
              subTopic.topics.forEach((part) => {
                if (part.id === topicId) {
                  part.status = 1; // Đánh dấu part hoàn thành
                }
              });

              // Kiểm tra nếu tất cả part đã hoàn thành
              const isSubTopicCompleted = subTopic.topics.every(
                (part) => part.status === 1
              );

              subTopic.status = isSubTopicCompleted ? 1 : subTopic.status;
            }
          });

          const isSubTopicCompleted = topic.topics.every(
            (part) => part.status === 1
          );

          // Nếu tất cả subtopic đã hoàn thành, cập nhật trạng thái topic
          topic.status = isSubTopicCompleted ? 1 : topic.status;

          console.log('🚀 ~ .modify ~ topic:', topic);
        });

      console.log('✅ Update success: Topics modified.');
    } catch (error) {
      console.error('❌ Error in finishQuestionThunk:', error);
    }
  }
);

export default finishQuestionThunk;
