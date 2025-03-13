import { MtUiButton } from '@ui/components/button';
import { db } from '@ui/db';
import { useAppDispatch } from '@ui/redux/store';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { TypeParam } from '@ui/constants';
import { ITopicBase } from '@ui/models/topics';
import { shouldEnableAnimation } from '@ui/redux/features/appInfo';
import queryString from 'query-string';
import { calculatePassingApp } from '../calculate';

const updateTurnTopic = async (id: number) => {
  try {
    await db?.topics
      .where('id')
      .equals(id)
      .modify((topic) => {
        topic.turn = (topic.turn ?? 0) + 1;
        topic.status = 0;
      });
  } catch (error) {
    console.error('❌ Error updating turn for part:', error);
  }
};

const formatNumber = (num: number) =>
  Number.isInteger(num) ? num : num.toFixed(1);

type IProps = {
  currentPart: ITopicBase | null;
  nextPart: ITopicBase | null;
  extraPoint: number;
  topic?: string;
  isNextSubTopic?: boolean;
  isNextTopic: boolean;
  topicId?: number;
};
const PassingFinishPage = ({
  nextPart,
  currentPart,
  extraPoint,
  topic,
  isNextTopic,
  isNextSubTopic,
  topicId,
}: IProps) => {
  const router = useRouter();
  const [passing, setPassing] = useState(0);

  useEffect(() => {
    calculatePassingApp().then(setPassing);
  }, []);

  const oldPassing = useMemo(() => passing - extraPoint, [passing, extraPoint]);
  const dispatch = useAppDispatch();

  const handleNextPart = useCallback(() => {
    if (!nextPart) return;
    dispatch(shouldEnableAnimation());
    const param = queryString.stringify({
      type: TypeParam.learn,
      partId: nextPart.id,
      topicId: topicId,
      topic: topic,
    });
    setTimeout(() => {
      router.push(`/${nextPart.slug}?${param}`, { scroll: true });
    }, 300);
  }, [nextPart, topicId, router, topic]);

  const handleTryAgain = useCallback(async () => {
    if (!currentPart?.id) return;
    await updateTurnTopic(currentPart.id);
    const param = queryString.stringify({
      type: TypeParam.learn,
      partId: currentPart.id,
      topicId: topicId,
      topic: topic,
    });
    router.push(`/${topic}?${param}`);
  }, [currentPart, topic, router, topicId]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full rounded-xl bg-[#7C6F5B] gap-6 flex px-4 py-2 items-center">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <p className="text-xs sm:text-lg max-w-32 sm:max-w-72 text-center font-medium text-white">
            Passing Probability
          </p>
          <span className="text-2xl text-white">{formatNumber(passing)}%</span>
        </div>

        <div className="bg-white  rounded-lg h-9  flex-1 relative">
          <div className="w-full custom-finish-progress absolute p-2 inset-0 z-10">
            <progress
              value={extraPoint}
              max={extraPoint}
              className="rounded-lg"
              style={{
                width: `${extraPoint}%`,
              }}
            />
          </div>
          <div className="w-full custom-finish-progress absolute p-2  inset-0 z-20">
            <progress
              value={oldPassing}
              max={oldPassing}
              className=" rounded-lg"
              style={{
                width: `${oldPassing}%`,
                background: '#12E1AF',
              }}
            />
          </div>

          <p className="absolute text-[#12E1AF] text-base right-2 top-0 bottom-0 flex items-center z-50">
            {' '}
            + {formatNumber(extraPoint)} %
          </p>
        </div>
      </div>

      <div className="flex fixed sm:static bottom-0 left-0 z-20 bg-theme-white sm:bg-transparent pb-8 sm:pb-2 px-4 pt-6 gap-4 max-w-[480px] w-full items-center">
        <MtUiButton
          block
          size="large"
          className="text-primary bg-white border-primary"
          onClick={handleTryAgain}
        >
          Try Again
        </MtUiButton>
        {isNextTopic && (
          <MtUiButton
            block
            size="large"
            type="primary"
            onClick={handleNextPart}
          >
            {isNextSubTopic ? 'Next Sub Topic' : 'Continue'}
          </MtUiButton>
        )}
      </div>
    </div>
  );
};

export default React.memo(PassingFinishPage);
