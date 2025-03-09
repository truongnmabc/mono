'use client';
import ReviewAnswerResult from '@ui/components/reviewAnswers';
import { db } from '@ui/db';
import { ICurrentGame } from '@ui/models/game';
import { IQuestionOpt } from '@ui/models/question';
import { resetState } from '@ui/redux/features/game';
import { mapQuestionsWithProgress } from '@ui/redux/repository/utils/handle';
import { useAppDispatch } from '@ui/redux/store';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
const AllQuestions = ({ isMobile }: { isMobile: boolean }) => {
  const [tableData, setTabletData] = useState<{
    all: ICurrentGame[];
    defaultData: ICurrentGame[];
    correct: ICurrentGame[];
    incorrect: ICurrentGame[];
  }>({
    all: [],
    defaultData: [],
    correct: [],
    incorrect: [],
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleGetData = async () => {
      dispatch(resetState());
      const progress = await db?.userProgress.toArray();
      const listIds = progress?.map((item) => item?.id) || [];
      if (!progress || progress.length === 0) return;

      const questions = await db?.questions
        .where('id')
        .anyOf(listIds)
        .toArray();

      if (!questions) return;

      const allQuestions = mapQuestionsWithProgress(
        questions || [],
        progress
      ) as IQuestionOpt[];

      setTabletData({
        all: allQuestions,
        defaultData: allQuestions,
        correct: allQuestions.filter((item) => item.selectedAnswer?.correct),
        incorrect: allQuestions.filter((item) => !item.selectedAnswer?.correct),
      });
    };
    handleGetData();
  }, []);

  return (
    <div className={clsx('w-full flex-1 flex transition-all flex-col  ')}>
      <ReviewAnswerResult
        tableData={tableData}
        showFilter={false}
        isMobile={isMobile}
        type={isMobile ? 'custom' : 'default'}
      />
    </div>
  );
};

export default AllQuestions;
