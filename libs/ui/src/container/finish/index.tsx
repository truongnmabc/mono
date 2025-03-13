'use client';
import TitleCollapse from '@ui/components/allowExpand/titleCollapse';
import MyContainer from '@ui/components/container';
import { TypeParam } from '@ui/constants';
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
  const [progress, questions, topics] = await Promise.all([
    db?.userProgress.where('parentId').equals(partId).toArray(),
    db?.questions.where('partId').equals(partId).toArray(),
    db?.topics.where('slug').equals(topic).sortBy('orderIndex'),
  ]);

  return { progress, questions, topics };
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
        (answer) => answer.turn === turn && answer.type === TypeParam.learn
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
  attemptNumber,
}: {
  progress: IUserQuestionProgress[];
  attemptNumber: number;
}) => {
  const passingAppInfo = await db?.passingApp.get(-1);

  const passingPart = await totalPassingPart({
    progress,
    averageLevel: passingAppInfo?.averageLevel || 50,
    turn: attemptNumber,
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
  attemptNumber,
}: {
  topic?: string;
  resultId?: number;
  index?: string;
  attemptNumber?: number;
}) => {
  const [game, setGame] = useState<{
    currentPart: ITopicBase | null;
    nextPart: ITopicBase | null;
    extraPoint: number;
    total: number;
    correct: number;
    isNextTopic: boolean;
    isNextSubTopic: boolean;
    indexPart: number;
  }>({
    currentPart: null,
    nextPart: null,
    extraPoint: 0,
    total: 1,
    correct: 0,
    isNextTopic: false,
    isNextSubTopic: false,
    indexPart: 0,
  });
  const [listSubTopics, setListSubTopics] = useState<ITopicBase[]>([]);
  const isDataFetched = useAppSelector(selectIsDataFetched);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsStartAnimationPrevious(true));

    if (!topic || !resultId || !attemptNumber || !isDataFetched) return;
    const handleGetData = async () => {
      try {
        const { topics, progress, questions } = await getCurrentProgressData({
          partId: resultId,
          topic,
        });

        if (!topics || !progress || !questions) return;

        const { correct, total } = calculateProgress(
          progress,
          questions,
          attemptNumber
        );

        const { extraPoint } = await calculateProgressPassing({
          progress,
          attemptNumber,
        });

        const listCore = topics.filter((t) => t.type === 3);
        const currentPart = topics.find((t) => t.id === resultId);
        if (!currentPart) return;

        // 🔹 Tìm danh sách các part cùng `parentId` với `currentPart`
        const subTopics = topics.filter(
          (t) => t.parentId === currentPart.parentId
        );
        const indexPart = subTopics.findIndex((t) => t.id === resultId) + 1;

        // 🔹 Tìm nextPart trong cùng parentId (thằng tiếp theo chưa hoàn thành)
        let nextPart = subTopics.find(
          (t) => t.status === 0 && t.id !== resultId
        );

        // 🔹 Nếu tất cả part trong `subTopics` đã hoàn thành, tìm part trong `sub` tiếp theo
        if (!nextPart) {
          const subs = topics
            .filter((t) => t.type === 2)
            .sort((a, b) => a.orderIndex - b.orderIndex);
          const currentSubIndex = subs.findIndex(
            (s) => s.id === currentPart.parentId
          );

          if (currentSubIndex !== -1) {
            // 🔹 Tìm `sub` tiếp theo
            const nextSub = subs[currentSubIndex + 1] || subs[0];

            // 🔹 Tìm `part` đầu tiên chưa hoàn thành trong `sub` tiếp theo
            nextPart = listCore.find(
              (t) => t.parentId === nextSub.id && t.status === 0
            );
          }
        }

        setGame({
          currentPart,
          nextPart: nextPart || null,
          correct,
          total,
          extraPoint,
          isNextTopic: !!nextPart,
          isNextSubTopic: !topics.find(
            (t) =>
              t.type === 3 &&
              t.status === 0 &&
              t.parentId === currentPart.parentId
          ),
          indexPart: indexPart,
        });

        // 🔹 Tạo danh sách sub-topic với các part tương ứng
        const subsWithTopics = topics
          .filter((t) => t.type === 2)
          .map((sub) => ({
            ...sub,
            topics: listCore.filter((item) => item.parentId === sub.id) || [],
          })) as ITopicBase[];

        setListSubTopics(subsWithTopics);

        // const subTopics = topics.filter(
        //   (t) => t.parentId === currentPart?.parentId
        // );
        // const indexPart = subTopics.findIndex((t) => t.id === resultId) + 1;
        // if (!currentPart) return;
        // const sub = listCore
        //   .filter((t) => t.parentId === currentPart.parentId)
        //   .sort((a, b) => a.orderIndex - b.orderIndex);

        // if (!sub) return;

        // const nextPart = sub.find((t) => t.status === 0);

        // const subs = topics.filter((t) => t.type === 2) || [];

        // const subsWithTopics = subs.map((sub) => ({
        //   ...sub,
        //   topics: listCore.filter((item) => item.parentId === sub.id) || [],
        // })) as ITopicBase[];

        // setGame({
        //   currentPart,
        //   nextPart: nextPart || null,
        //   correct,
        //   total,
        //   extraPoint,
        //   isNextTopic: !!nextPart,
        //   isNextSubTopic: false,
        //   indexPart: indexPart,
        // });
        // setListSubTopics(subsWithTopics);
      } catch (err) {}
    };

    handleGetData();
  }, [resultId, attemptNumber, topic, isDataFetched]);

  return (
    <MyContainer>
      <WrapperAnimation>
        <TitleFinishPage topic={topic} index={game.indexPart} />
        <ProgressFinishPage correct={game.correct} total={game.total} />
        <PassingFinishPage
          {...game}
          topic={topic}
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
