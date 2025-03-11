'use client';
import { TypeParam } from '@ui/constants';
import {
  IBranchHomeJson,
  IThunkFunctionReturn,
  ITopicHomeJson,
} from '@ui/models/other';
import { IQuestionOpt } from '@ui/models/question';
import { IGameMode } from '@ui/models/tests/tests';
import getDataResultTestThunk from '@ui/redux/repository/game/result';
import { useAppDispatch } from '@ui/redux/store';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ResultProvider } from './resultContext';
const DiagnosticTestResult = dynamic(() => import('./layout/diagnosticTest'), {
  ssr: false,
});
const PracticeTestsResult = dynamic(() => import('./layout/practiceTests'), {
  ssr: false,
});

const FinalTestsResult = dynamic(() => import('./layout/finalTets'), {
  ssr: false,
});
export interface ITopicEndTest extends ITopicHomeJson {
  totalQuestion: number;
  correct: number;
}
export interface IPropsState {
  listTopic: ITopicEndTest[];
  all: number;
  correct: number;
  passing: number;
  isPass: boolean;
}

interface GameResult {
  incorrectQuestions: IQuestionOpt[];
  correctQuestions: IQuestionOpt[];
  questions: IQuestionOpt[];
  listTopic: { id: number; totalQuestion: number; correct: IQuestionOpt[] }[];
  passing: number;
  isPass: boolean;
}

const ResultTestLayout = ({
  isMobile,
  gameMode,
  resultId,
  topics,
  branchTest,
}: {
  isMobile: boolean;
  gameMode?: IGameMode;
  resultId?: number;
  topics?: ITopicHomeJson[];
  branchTest?: IBranchHomeJson['list'];
}) => {
  const [correctIds, setCorrectIds] = useState<number[]>([]);
  const [result, setResult] = useState<IPropsState>({
    listTopic: [],
    all: 0,
    correct: 0,
    passing: 0,
    isPass: false,
  });

  const [tableData, setTabletData] = useState<{
    all: IQuestionOpt[];
    correct: IQuestionOpt[];
    incorrect: IQuestionOpt[];
    defaultData: IQuestionOpt[];
  }>({
    all: [],
    correct: [],
    incorrect: [],
    defaultData: [],
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleGetData = async () => {
      if (!resultId || !gameMode) return;
      const result = (await dispatch(
        getDataResultTestThunk({ gameMode, resultId })
      )) as IThunkFunctionReturn<GameResult>;

      if (result.meta.requestStatus === 'fulfilled') {
        const {
          incorrectQuestions,
          correctQuestions,
          questions,
          listTopic,
          passing,
          isPass,
        } = result.payload;
        setResult({
          listTopic: listTopic?.map((item) => {
            const topic = topics?.find((t) => t.id === item.id);
            return {
              id: item.id,
              totalQuestion: item.totalQuestion,
              correct: item.correct.length,
              icon: topic?.icon || '',
              name: topic?.name || '',
              slug: topic?.slug || '',
              topics: topic?.topics || [],
              orderIndex: topic?.orderIndex || 0,
            };
          }),
          all: questions.length,
          correct: correctQuestions.length,
          passing: passing,
          isPass: isPass,
        });
        setCorrectIds(correctQuestions.map((i) => i.id));
        setTabletData({
          all: questions,
          incorrect: incorrectQuestions,
          correct: correctQuestions,
          defaultData: questions,
        });
      }
    };
    handleGetData();
  }, [gameMode, resultId, topics, dispatch]);

  return (
    <ResultProvider
      value={{
        correctIds,
        result,
        setTableData: setTabletData,
        tableData: tableData,
        correct: result.correct,
        isPass: result.isPass,
        passing: result.passing,
        total: result.all,
        listTopic: result.listTopic,
        topics,
        resultId,
        branchTest,
      }}
    >
      <div className="w-full flex-1">
        {gameMode === TypeParam.diagnosticTest && (
          <DiagnosticTestResult isMobile={isMobile} gameMode={gameMode} />
        )}
        {(gameMode === TypeParam.practiceTests ||
          gameMode === TypeParam.customTests ||
          gameMode === TypeParam.review ||
          gameMode === TypeParam.branchTest) && (
          <PracticeTestsResult isMobile={isMobile} gameMode={gameMode} />
        )}

        {gameMode === TypeParam.finalTests && (
          <FinalTestsResult isMobile={isMobile} gameMode={gameMode} />
        )}
      </div>
    </ResultProvider>
  );
};

export default ResultTestLayout;
