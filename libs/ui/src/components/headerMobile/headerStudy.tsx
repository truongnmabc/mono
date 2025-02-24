'use client';

import {
  selectCurrentSubTopicIndex,
  selectGameMode,
} from '@ui/redux/features/game.reselect';
import { shouldOpenSubmitTest } from '@ui/redux/features/tests';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import IconBack from '@ui/components/icon/iconBack';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { Fragment } from 'react';
import IconSubmit from '../icon/iconSubmit';
import { getKeyTest, getLastPathSegment } from '../titleQuestion';

const HeaderStudy = () => {
  const indexSubTopic = useAppSelector(selectCurrentSubTopicIndex);
  const type = useAppSelector(selectGameMode);
  const param = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const defaultTitle =
    getKeyTest(param?.['slug']) || getLastPathSegment(pathname);

  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    dispatch(shouldOpenSubmitTest(true));
  };
  return (
    <Fragment>
      <div className="flex sm:hidden items-center p-2 justify-between">
        <div
          onClick={() => {
            router.back();
          }}
          className="cursor-pointer"
        >
          <IconBack size={20} />
        </div>

        <div className=" text-center flex-1 capitalize text-lg font-medium">
          {type === 'learn' ? `Core ${indexSubTopic}` : defaultTitle}
        </div>
        {type !== 'learn' && (
          <div onClick={handleSubmit}>
            <IconSubmit />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default React.memo(HeaderStudy);
