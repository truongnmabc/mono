import GridTestsLeft from '@ui/components/gridTests';
import GridTopicLeft from '@ui/components/gridTopics';
import RouterApp from '@ui/constants/router.constant';
import { IPracticeTestsHomeJson, IBranchHomeJson } from '@ui/models/other';
import { ITopicHomeJson } from '@ui/models/other';
import { IGameMode } from '@ui/models/tests/tests';
import Link from 'next/link';
import React from 'react';
const QuestionGroup = ({
  type,
  data,
  appShortName,
  id,
}: {
  type: IGameMode;
  data: {
    topics: ITopicHomeJson[];
    tests: IPracticeTestsHomeJson;
    branch: IBranchHomeJson;
  };
  appShortName: string;
  id?: string;
}) => {
  const tests = type === 'branchTest' ? data.branch.list : data.tests.list;
  return (
    <div className="hidden sm:block w-full">
      <div className="flex p-3 bg-white rounded-xl flex-col gap-4">
        {type === 'practiceTests' || type === 'branchTest' ? (
          <>
            <GridTestsLeft
              appShortName={appShortName}
              type={type}
              id={id}
              tests={tests}
            />
            <div className="w-full h-[1px] bg-[#21212129]"></div>
            <GridTopicLeft
              appShortName={appShortName}
              type={type}
              id={id}
              topics={data.topics}
            />
          </>
        ) : (
          <>
            <GridTopicLeft
              appShortName={appShortName}
              type={type}
              id={id}
              topics={data.topics}
            />
            <div className="w-full h-[1px] bg-[#21212129]"></div>
            <GridTestsLeft
              appShortName={appShortName}
              type={type}
              id={id}
              tests={tests}
            />
          </>
        )}
        <div className="w-full h-[1px] bg-[#21212129]"></div>
        <Link href={`${RouterApp.Final_test}`}>
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
    </div>
  );
};
export default React.memo(QuestionGroup);
