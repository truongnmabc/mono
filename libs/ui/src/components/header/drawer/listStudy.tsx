import { ExpandMore } from '@mui/icons-material';
import { TypeParam } from '@ui/constants';
import { ITopicHomeJson } from '@ui/models/other';
import ctx from '@ui/utils/twClass';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useState } from 'react';

const ListStudyDrawer = ({
  setOpenMenuDrawer,
  appShortName,
  appName,
  topics,
}: {
  setOpenMenuDrawer: (e: boolean) => void;
  topics: ITopicHomeJson[];
  appShortName: string;
  appName: string;
}) => {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <div className="p-3">
      <div
        className="flex justify-between sm:justify-start cursor-pointer gap-4 items-center"
        onClick={() => {
          setIsExpand(!isExpand);
        }}
      >
        <div className=" font-poppins text-xl sm:text-2xl capitalize font-semibold">
          {appName} Subtest
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
        {topics.map((item, index) => (
          <Link
            key={index}
            href={item.slug + `?type=${TypeParam.learn}&id=${item.id}`}
          >
            <div
              className="hover:bg-[#2121211f] relative overflow-hidden cursor-pointer"
              onClick={() => setOpenMenuDrawer(false)}
            >
              <div className="p-2 text-sm sm:text-lg capitalize">
                {item.slug
                  ?.replaceAll('-', ' ')
                  .replace(appShortName, '')
                  .replace('practice', '')
                  .replace('test', '')}
              </div>
              {index + 1 < topics.length && (
                <div className="w-full h-[1px] bg-[#e4e4e4] "></div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ListStudyDrawer);
