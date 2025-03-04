'use client';
import MyContainer from '@ui/components/container';
import { db } from '@ui/db';
import { IUserQuestionProgress } from '@ui/models/progress';
import { IQuestionBase } from '@ui/models/question';
import { ITopicBase } from '@ui/models/topics';
import React, { useEffect, useState } from 'react';
import { totalPassingPart } from './calculate';
import GridTopicProgress from './gridTopic';
import PassingFinishPage from './passing';
import ProgressFinishPage from './progress';
import TitleFinishPage from './title';

const getCurrentProgressData = async ({
  partId,
  topic,
}: {
  partId: number;
  topic: string;
}) => {
  const [progress, questions, currentTopic] = await Promise.all([
    db?.userProgress.where('parentId').equals(partId).toArray(),
    db?.questions.where('partId').equals(partId).toArray(),
    db?.topics.where('slug').equals(topic).sortBy('index'),
  ]);

  return { progress, questions, currentTopic };
};

const calculateProgress = (
  progress: IUserQuestionProgress[],
  questions: IQuestionBase[],
  turn: number
) => {
  const correctAnswers =
    progress?.filter((item) => {
      // Lấy lần đầu tiên người dùng trả lời câu hỏi trong lần làm bài (turn)
      const firstAnswer = item.selectedAnswers.find(
        (answer) => answer.turn === turn && answer.type === 'learn'
      );

      // Nếu lần đầu tiên trả lời đúng, tính vào số câu đúng
      return firstAnswer?.correct;
    }).length || 0;

  return {
    correct: correctAnswers,
    total: questions?.length || 1,
  };
};

const findNextPart = async ({
  currentTopic,
  currentSubTopic,
}: {
  currentTopic: ITopicBase;
  currentSubTopic?: ITopicBase;
}) => {
  if (!currentTopic || !currentSubTopic)
    return {
      nextPart: null,
      index: -1,
      isNextSubTopic: false,
      isNextTopic: false,
    };

  // Tìm part chưa hoàn thành trong subtopic hiện tại
  const nextPartIndex = currentSubTopic.topics.findIndex((p) => p.status === 0);
  if (nextPartIndex !== -1) {
    return {
      nextPart: currentSubTopic.topics[nextPartIndex],
      index: nextPartIndex,
      isNextSubTopic: false,
      isNextTopic: false,
    };
  }

  // Nếu tất cả part của subtopic đã hoàn thành, tìm subtopic khác chưa hoàn thành
  const nextSubTopic = currentTopic.topics.find((sub) => sub.status === 0);
  if (nextSubTopic) {
    const nextPartIndex = nextSubTopic.topics.findIndex((p) => p.status === 0);
    if (nextPartIndex !== -1) {
      return {
        nextPart: nextSubTopic.topics[nextPartIndex],
        index: nextPartIndex,
        isNextSubTopic: true,
        isNextTopic: false,
      };
    }
  }

  // Nếu tất cả subtopic đã hoàn thành, tìm topic tiếp theo trong danh sách topic
  const nextTopic = await db?.topics
    .filter((topic) => topic.status === 0)
    .first();
  if (nextTopic) {
    const nextSubTopic = nextTopic.topics.find((sub) => sub.status === 0);
    if (nextSubTopic) {
      const nextPartIndex = nextSubTopic.topics.findIndex(
        (p) => p.status === 0
      );
      if (nextPartIndex !== -1) {
        return {
          nextPart: nextSubTopic.topics[nextPartIndex],
          index: nextPartIndex,
          isNextSubTopic: false,
          isNextTopic: true,
        };
      }
    }
  }

  // Nếu không tìm thấy part nào, trả về null
  return {
    nextPart: null,
    index: -1,
    isNextSubTopic: false,
    isNextTopic: false,
  };
};

const calculateProgressPassing = async ({
  progress,
  turn,
}: {
  progress: IUserQuestionProgress[];
  turn: number;
}) => {
  const passingAppInfo = await db?.passingApp.get(-1);

  const passingPart = await totalPassingPart({
    progress,
    averageLevel: passingAppInfo?.averageLevel || 50,
    turn,
  });

  if (passingAppInfo) {
    return {
      extraPoint: (passingPart / passingAppInfo.totalQuestion) * 100,
    };
  }
  return {
    extraPoint: 0,
  };
};

const FinishLayout = ({
  topic,
  resultId,
  index,
  turn,
}: {
  topic?: string;
  resultId?: number;
  index?: string;
  turn?: number;
}) => {
  const [game, setGame] = useState<{
    currentPart: ITopicBase | null;
    nextPart: ITopicBase | null;
    extraPoint: number;
    total: number;
    correct: number;
  }>({
    currentPart: null,
    nextPart: null,
    extraPoint: 0,
    total: 1,
    correct: 0,
  });
  const subIndex = Number(index?.split('.')[1] || 0);

  useEffect(() => {
    if (!topic || !resultId || !turn) return;
    const handleGetData = async () => {
      const { currentTopic, progress, questions } =
        await getCurrentProgressData({
          partId: resultId,
          topic,
        });

      if (!currentTopic || !progress || !questions) return;

      const { correct, total } = calculateProgress(progress, questions, turn);

      const { extraPoint } = await calculateProgressPassing({
        progress,
        turn,
      });

      const currentIndex = currentTopic.findIndex((t) => t.id === resultId);
      const currentPart = currentTopic[currentIndex];
      const nextPart = currentTopic
        .slice(currentIndex + 1) // Lấy các topic sau topic hiện tại
        .find((topic) => topic.status === 0);

      setGame({
        currentPart,
        nextPart: nextPart || null,
        correct,
        total,
        extraPoint,
      });
    };

    handleGetData();
  }, [resultId, turn, topic]);

  return (
    <MyContainer>
      <div className="w-full py-6 h-full gap-8 flex flex-col">
        <TitleFinishPage topic={topic} index={(subIndex + 1).toString()} />
        <ProgressFinishPage correct={game.correct} total={game.total} />
        <PassingFinishPage {...game} topic={topic} currentTurn={turn || 1} />
        <GridTopicProgress />
      </div>
    </MyContainer>
  );
};

export default React.memo(FinishLayout);
