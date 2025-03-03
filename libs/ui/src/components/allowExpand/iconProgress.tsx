'use client';
import { db } from '@ui/db';
import { ITopicHomeJson } from '@ui/models/other';
import {
  selectAttemptNumber,
  selectListQuestion,
} from '@ui/redux/features/game.reselect';
import { IStatusTopic } from '@ui/redux/features/study';
import { selectListStatus } from '@ui/redux/features/study.reselect';
import { useAppSelector } from '@ui/redux/store';
import clsx from 'clsx';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { IconSubTopic } from './iconTopic';

type IProps = {
  part: ITopicHomeJson;
  index: number;
  isPass?: boolean;
};

const IconProgress = ({ part, index }: IProps) => {
  const listStatus = useAppSelector(selectListStatus);
  const status = listStatus.find((item) => item.id === part.id);
  return (
    <div
      className={clsx('w-14 z-10  flex flex-col  items-center justify-center', {
        'cursor-pointer': status?.status !== 'locked',
        'cursor-not-allowed': status?.status === 'locked',
      })}
      key={index}
    >
      <Link
        href={`${part.slug}?type=learn&partId=${part?.id}`}
        onClick={(e) => {
          if (status?.status === 'locked') {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <Fragment>
          <IconWrapper part={part} status={status?.status || 'locked'} />
          <div className="max-w-14 text-center pt-1 text-[10px] text-[#212121] truncate">
            Core {index}
          </div>
        </Fragment>
      </Link>
    </div>
  );
};

export default IconProgress;
const IconWrapper = ({
  part,
  status,
}: {
  part: ITopicHomeJson;
  status: IStatusTopic;
}) => {
  const listQuestion = useAppSelector(selectListQuestion);
  const turn = useAppSelector(selectAttemptNumber);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!listQuestion.length || !turn || status !== 'unlocked') return;

    const fetchProgress = async () => {
      try {
        const allProgressData = await db?.userProgress
          .where('parentId')
          .equals(part.id)
          .toArray();

        const progressData = allProgressData?.filter((item) =>
          item.selectedAnswers.some((ans) => ans.turn === turn && ans.correct)
        );
        if (progressData?.length)
          setProgress(
            progressData.length
              ? Math.floor((progressData.length / listQuestion.length) * 100)
              : 0
          );
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [part.id, listQuestion.length, turn, status]);

  const currentLevelScore =
    status === 'completed' ? 100 : status === 'unlocked' ? progress : 0;

  return (
    <IconSubTopic
      lock={status === 'locked'}
      activeAnim={status === 'unlocked'}
      isFinishThisLevel={status === 'completed'}
      currentLevelScore={currentLevelScore}
    />
  );
};
