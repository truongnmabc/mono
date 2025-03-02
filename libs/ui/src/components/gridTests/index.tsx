'use client';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { ITestBase } from '@ui/models/tests';
import { IGameMode } from '@ui/models/tests/tests';
import React, { useCallback } from 'react';
import ItemTestLeft from './itemTest';
import { TypeParam } from '@ui/constants';
import clsx from 'clsx';
import Link from 'next/link';
import IconGridTest from '@ui/components/icon/iconGridTest';
export interface IListTest extends ITestBase {
  index: number;
  title: string;
}
const FN = ({
  appShortName,
  type,
  id,
  tests,
}: {
  appShortName: string;
  type?: IGameMode;
  id?: string;
  tests: IListTest[];
}) => {
  const [open, setOpen] = React.useState(
    type === TypeParam.practiceTest || type === TypeParam.branchTest
  );

  const handleClick = () => {
    setOpen(!open);
  };

  const sortedTests = tests.sort((a, b) => {
    if (String(a.id) === id) return -1; // Đưa testId lên đầu
    if (String(b.id) === id) return 1;
    return 0;
  });

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
          {sortedTests?.map((test, index) => (
            <Link href={'#'} key={index}>
              <div
                className={clsx(
                  'bg-white cursor-pointer p-2 hover:border-primary rounded-md border border-solid w-full flex items-center',
                  {
                    'border-primary': id === test?.id?.toString(),
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
                  Practice Tests {index + 1}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

const GridTestsLeft = React.memo(FN);
export default GridTestsLeft;
