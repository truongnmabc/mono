'use client';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import IconGridTest from '@ui/components/icon/iconGridTest';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { db } from '@ui/db';
import { IBranchHomeJson } from '@ui/models/other';
import { ITestBase } from '@ui/models/tests';
import { IGameMode } from '@ui/models/tests/tests';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import queryString from 'query-string';
import React, { Fragment, useEffect } from 'react';

const AnswerSheetTest = dynamic(
  () => import('@ui/components/listLeftQuestions'),
  {
    ssr: false,
  }
);
export interface IListTest extends ITestBase {
  index: number;
  title: string;
}
const FN = ({
  appShortName,
  type,
  testId,
  tests,
}: {
  appShortName: string;
  type?: IGameMode;
  testId?: number;
  tests: IBranchHomeJson['list'];
}) => {
  const [open, setOpen] = React.useState(
    type === TypeParam.practiceTests || type === TypeParam.branchTest
  );

  const [currentTestId, setCurrentTestId] = React.useState<number>(
    testId || -1
  );

  useEffect(() => {
    if ((!testId || testId === -1) && type) {
      const handleGetId = async () => {
        const res = await db?.testQuestions
          .where('gameMode')
          .equals(type)
          .toArray();
        if (res) {
          const testId = res.find((item) => item.status === 0);
          if (testId) {
            setCurrentTestId(testId.id);
          }
        }
      };
      handleGetId();
    }
  }, [testId, type]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className="text-xl font-poppins capitalize font-semibold">
      <div
        className="flex justify-between items-center w-full"
        onClick={handleClick}
      >
        <h3 className="font-semibold text-xl font-poppins">
          More <span className="uppercase">{appShortName}</span> Tests
        </h3>
        {open ? <ExpandLess /> : <ExpandMore />}
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className="w-full flex mt-3 flex-col gap-2">
          {tests?.map((test, index) => {
            const query = queryString.stringify({
              testId: test.id,
              type:
                type === TypeParam.branchTest
                  ? TypeParam.branchTest
                  : TypeParam.practiceTests,
            });
            const _href =
              type === TypeParam.branchTest
                ? `${test.slug}?${query}`
                : `${RouterApp.Practice_Tests}?${query}`;

            return (
              <Fragment key={index}>
                <Link href={_href}>
                  <div
                    className={clsx(
                      'bg-white cursor-pointer p-2 hover:border-primary rounded-md border border-solid w-full flex items-center',
                      {
                        'border-primary': currentTestId === test?.id,
                      }
                    )}
                  >
                    <div className=" bg-primary-16 rounded-md p-[6px] h-full aspect-square flex items-center justify-center">
                      <IconGridTest />
                    </div>
                    <h3
                      className={clsx(
                        'text-xs  pl-3  pr-2 flex-1 truncate font-medium'
                      )}
                    >
                      {test.name}
                    </h3>
                  </div>
                </Link>
                {currentTestId === test?.id && type !== TypeParam.learn && (
                  <AnswerSheetTest
                    isPracticeTest
                    wrapperClassName="bg-[#2121210A] rounded-lg"
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </Collapse>
    </div>
  );
};

const GridTestsLeft = React.memo(FN);
export default GridTestsLeft;
