'use client';
import MyContainer from '@ui/components/container';
import { db } from '@ui/db';
import { IQuestionBase } from '@ui/models/question';
import { selectAttemptNumber } from '@ui/redux/features/game.reselect';
import { useAppSelector } from '@ui/redux/store';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { totalPassingPart } from './calculate';
import GridTopicProgress from './gridTopic';
import PassingFinishPage from './passing';
import ProgressFinishPage from './progress';
import TitleFinishPage from './title';
import { IUserQuestionProgress } from '@ui/models/progress';
import { ITopicBase } from '@ui/models/topics';

const getCurrentProgressData = async ({
  partId,
  topicName,
}: {
  partId: string;
  topicName: string;
}) => {
  const [progress, questions, currentTopic] = await Promise.all([
    db?.userProgress.where('parentId').equals(Number(partId)).toArray(),
    db?.questions.where('partId').equals(Number(partId)).toArray(),
    db?.topics.where('slug').equals(topicName).first(),
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

const FinishLayout = () => {
  const subTopicId = useSearchParams()?.get('subTopicId');
  const partId = useSearchParams()?.get('partId');
  const topicName = useSearchParams()?.get('topic') || '';
  const turn = useAppSelector(selectAttemptNumber);

  const [game, setGame] = useState<{
    currentPart: ITopicBase | null;
    nextPart: ITopicBase | null;
    currentTurn: number;
    extraPoint: number;
    total: number;
    correct: number;
    currentTopicId: number;
    indexSubTopic: number;
    isNextSubTopic: boolean;
    isNextTopic: boolean;
  }>({
    currentPart: null,
    currentTopicId: 0,
    nextPart: null,
    currentTurn: 0,
    extraPoint: 0,
    total: 1,
    correct: 0,
    indexSubTopic: 1,
    isNextSubTopic: false,
    isNextTopic: false,
  });

  const handleGetData = useCallback(async () => {
    if (!subTopicId || !partId || !turn) return;

    const { currentTopic, progress, questions } = await getCurrentProgressData({
      partId,
      topicName,
    });

    if (!currentTopic || !progress || !questions) return;

    const { correct, total } = calculateProgress(progress, questions, turn);

    const currentSubTopic = currentTopic.topics.find(
      (t) => t.id === Number(subTopicId)
    );

    const currentPart =
      currentSubTopic?.topics.find((p) => p.id === Number(partId)) || null;

    const { nextPart, index, isNextSubTopic, isNextTopic } = await findNextPart(
      {
        currentTopic,
        currentSubTopic,
      }
    );

    const { extraPoint } = await calculateProgressPassing({
      progress,
      turn,
    });

    setGame({
      currentPart,
      currentTopicId: currentTopic.id,
      nextPart,
      correct,
      total,
      currentTurn: currentPart?.turn || 1,
      extraPoint,
      indexSubTopic: index,
      isNextSubTopic,
      isNextTopic,
    });
  }, [subTopicId, partId, turn, topicName]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  return (
    <MyContainer>
      <div className="w-full py-6 h-full gap-8 flex flex-col">
        <TitleFinishPage />
        <ProgressFinishPage correct={game.correct} total={game.total} />
        <PassingFinishPage {...game} />
        <GridTopicProgress />
      </div>
    </MyContainer>
  );
};

export default React.memo(FinishLayout);
