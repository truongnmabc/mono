'use client';

import IconBack from '@ui/components/icon/iconBack';
import RouterApp from '@ui/constants/router.constant';
import { IGameMode } from '@ui/models/tests/tests';
import { selectCurrentSubTopicIndex } from '@ui/redux/features/game.reselect';
import { shouldOpenSubmitTest } from '@ui/redux/features/tests';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { IconSubmit } from '../icon/iconSubmit';

const HeaderStudy = ({ type }: { type: IGameMode }) => {
  const indexSubTopic = useAppSelector(selectCurrentSubTopicIndex);

  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    dispatch(shouldOpenSubmitTest(true));
  };
  return (
    <Fragment>
      <div className="flex sm:hidden items-center p-2 justify-between">
        <Link href={RouterApp.Home} className="cursor-pointer">
          <IconBack size={20} />
        </Link>

        <div className=" text-center flex-1 capitalize text-lg font-medium">
          {type === 'learn' ? `Core ${indexSubTopic}` : ''}
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
