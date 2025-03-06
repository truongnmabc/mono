'use client';
import TitleCollapse from '@ui/components/allowExpand/titleCollapse';
import MyContainer from '@ui/components/container';
import { db } from '@ui/db';
import { IUserQuestionProgress } from '@ui/models/progress';
import { IQuestionBase } from '@ui/models/question';
import { ITopicBase } from '@ui/models/topics';
import { setIsStartAnimationPrevious } from '@ui/redux/features/appInfo';
import { selectIsDataFetched } from '@ui/redux/features/appInfo.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import React, { useEffect, useState } from 'react';
import { totalPassingPart } from './calculate';
import PassingFinishPage from './passing';
import ProgressFinishPage from './progress';
import TitleFinishPage from './title';
import WrapperAnimation from './wrapperAnimation';

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
    isNextTopic: boolean;
  }>({
    currentPart: null,
    nextPart: null,
    extraPoint: 0,
    total: 1,
    correct: 0,
    isNextTopic: false,
  });
  const subIndex = Number(index?.split('.')[1] || 0);
  const [listSubTopics, setListSubTopics] = useState<ITopicBase[]>([]);
  const isDataFetched = useAppSelector(selectIsDataFetched);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setIsStartAnimationPrevious(true));

    if (!topic || !resultId || !turn || !isDataFetched) return;
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
        isNextTopic: !!nextPart,
      });

      const mainTopics = currentTopic.reduce((acc, topic) => {
        if (!acc.has(topic.parentId)) {
          acc.set(topic.parentId, []);
        }
        const group = acc.get(topic.parentId);
        if (group) {
          group.push(topic);
        }
        return acc;
      }, new Map());

      const parentTopicIds = Array.from(mainTopics.keys());
      const subs =
        (await db?.topics.where('id').anyOf(parentTopicIds).toArray()) || [];

      const subsWithTopics = subs.map((sub) => ({
        ...sub,
        topics: mainTopics.get(sub.id) || [],
      }));

      setListSubTopics(subsWithTopics || []);
    };

    handleGetData();
  }, [resultId, turn, topic, isDataFetched]);

  return (
    <MyContainer>
      <WrapperAnimation>
        <TitleFinishPage topic={topic} index={subIndex + 1} />
        <ProgressFinishPage correct={game.correct} total={game.total} />
        <PassingFinishPage
          {...game}
          topic={topic}
          currentTurn={turn || 1}
          index={index}
          topicId={listSubTopics[0]?.parentId}
        />
        <div className="flex gap-2 flex-col ">
          {listSubTopics.map((value) => (
            <TitleCollapse subTopic={value} key={value.id} />
          ))}
        </div>
      </WrapperAnimation>
    </MyContainer>
  );
};

export default React.memo(FinishLayout);
