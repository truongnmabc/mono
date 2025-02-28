import { ExpandMore } from '@mui/icons-material';
import { IContentSeo } from '@ui/models/seo';
import ctx from '@ui/utils/twClass';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useState } from 'react';

const ListStudyDrawer = ({
  setOpenMenuDrawer,
  appShortName,
  topics,
}: {
  setOpenMenuDrawer: (e: boolean) => void;
  topics: Record<string, IContentSeo>;
  appShortName: string;
}) => {
  const [isExpand, setIsExpand] = useState(false);
  const list = Object.keys(topics);

  return (
    <div className="p-3">
      <div
        className="flex justify-start cursor-pointer gap-4 items-center"
        onClick={() => {
          setIsExpand(!isExpand);
        }}
      >
        <div className=" font-poppins text-2xl capitalize font-semibold">
          {appShortName} Subtest
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
        {list.map((item, index) => (
          <Link key={index} href={item}>
            <div
              className="hover:bg-[#2121211f] relative overflow-hidden cursor-pointer"
              onClick={() => setOpenMenuDrawer(false)}
            >
              <div className="p-2 text-lg capitalize">
                {item
                  .replaceAll('-', ' ')
                  .replace(appShortName, '')
                  .replace('practice', '')
                  .replace('test', '')}
              </div>
              {index + 1 < list.length && (
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
