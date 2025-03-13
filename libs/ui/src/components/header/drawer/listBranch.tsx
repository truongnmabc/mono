import { ExpandMore } from '@mui/icons-material';
import { TypeParam } from '@ui/constants';
import { IBranchHomeJson } from '@ui/models/other';
import ctx from '@ui/utils/twClass';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useState } from 'react';

const ListBranchDrawer = ({
  setOpenMenuDrawer,
  branch,
  appShortName,
}: {
  setOpenMenuDrawer: (e: boolean) => void;
  branch: IBranchHomeJson['list'];
  appShortName: string;
}) => {
  const [isExpand, setIsExpand] = useState(false);
  const list = branch.map((item) => item.slug);

  return (
    <div className="p-3">
      <div
        className="flex justify-between sm:justify-start cursor-pointer gap-4 items-center"
        onClick={() => {
          setIsExpand(!isExpand);
        }}
      >
        <div className=" font-poppins text-xl sm:text-2xl capitalize font-semibold">
          {appShortName} Branch Test
        </div>

        <div
          className={clsx('transition-all', {
            'rotate-180': !isExpand,
          })}
        >
          <ExpandMore />{' '}
        </div>
      </div>

      <div
        className={ctx('transition-all mt-1', {
          hidden: !isExpand,
          block: isExpand,
        })}
      >
        {branch.map((key, index) => {
          return (
            <Link
              href={key.slug + `?type=${TypeParam.branchTest}&testId=${key.id}`}
              key={key.id}
            >
              <div
                className="hover:bg-[#2121211f] relative overflow-hidden cursor-pointer"
                onClick={() => setOpenMenuDrawer(false)}
              >
                <div className="p-2 text-sm sm:text-lg capitalize">
                  {key.slug
                    .replaceAll('-', ' ')
                    .replace(appShortName, appShortName.toUpperCase())}
                  {/* {list} */}
                </div>
                {index + 1 < branch.length && (
                  <div className="w-full h-[1px] bg-[#e4e4e4] "></div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(ListBranchDrawer);
