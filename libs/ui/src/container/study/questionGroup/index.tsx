import GridTestsLeft from '@ui/components/gridTests';
import GridTopicLeft from '@ui/components/gridTopics';
import RouterApp from '@ui/constants/router.constant';
import {
  IBranchHomeJson,
  IPracticeTestsHomeJson,
  ITopicHomeJson,
} from '@ui/models/other';
import { IGameMode } from '@ui/models/tests/tests';
import Link from 'next/link';
import React from 'react';
import WrapperAnimationLeft from '../mainStudyView/wrapperAnimationLeft';
import { TypeParam } from '@ui/constants';
const QuestionGroup = ({
  type,
  data,
  appShortName,
  topicId,
  testId,
}: {
  type: IGameMode;
  data: {
    topics: ITopicHomeJson[];
    tests: IPracticeTestsHomeJson;
    branch: IBranchHomeJson;
    finalTests: number;
  };
  appShortName: string;
  topicId?: number;
  testId?: number;
}) => {
  const tests = type === 'branchTest' ? data.branch.list : data.tests.list;
  return (
    <WrapperAnimationLeft>
      <div className="flex p-3 bg-white rounded-xl flex-col gap-4">
        {type !== TypeParam.learn ? (
          <>
            <GridTestsLeft
              appShortName={appShortName}
              type={type}
              testId={testId}
              tests={tests.sort((a, b) => {
                if (a.id === testId) return -1;
                if (b.id === testId) return 1;
                return 0;
              })}
            />
            <div className="w-full h-[1px] bg-[#21212129]"></div>
            <GridTopicLeft
              appShortName={appShortName}
              type={type}
              topics={data.topics.sort((a, b) => {
                if (a.id === topicId) return -1; // Đưa testId lên đầu
                if (b.id === topicId) return 1;
                return 0;
              })}
            />
          </>
        ) : (
          <>
            <GridTopicLeft
              appShortName={appShortName}
              type={type}
              topics={data.topics.sort((a, b) => {
                if (a.id === topicId) return -1; // Đưa testId lên đầu
                if (b.id === topicId) return 1;
                return 0;
              })}
            />
            <div className="w-full h-[1px] bg-[#21212129]"></div>
            <GridTestsLeft
              appShortName={appShortName}
              type={type}
              testId={testId}
              tests={tests.sort((a, b) => {
                if (a.id === testId) return -1;
                if (b.id === testId) return 1;
                return 0;
              })}
            />
          </>
        )}
        <div className="w-full h-[1px] bg-[#21212129]"></div>
        <Link
          href={`${RouterApp.Final_test}?type=${TypeParam.finalTests}&testId=${data.finalTests}`}
        >
          <div className="bg-primary w-full  text-center rounded-md p-2">
            <p className="text-base capitalize font-semibold text-white">
              <span className="text-base  font-semibold text-white uppercase">
                {appShortName}
              </span>{' '}
              Final Test
            </p>
          </div>
        </Link>
      </div>
    </WrapperAnimationLeft>
  );
};
export default React.memo(QuestionGroup);
