import { MtUiButton } from '@ui/components/button';
import { db } from '@ui/db';
import { useAppDispatch } from '@ui/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { ITopicBase } from '@ui/models/topics';
import { initLearnQuestionThunk } from '@ui/redux';
import { removeCompletedTest } from '@ui/services/server/actions';
import { calculatePassingApp } from '../calculate';
type NavigateToHrefParams = {
  topicName: string;
  nextPart: ITopicBase;
};

const updateTurnTopic = async ({ id }: { id: number }) => {
  try {
    await db?.topics
      .where('id')
      .equals(id)
      .modify((topic) => {
        topic.turn = (topic.turn ?? 0) + 1;
        topic.status = 0;
      });
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật turn của part:', error);
  }
};

const PassingFinishPage = ({
  nextPart,
  currentPart,
  currentTurn,
  extraPoint,
  topic,
}: {
  currentPart: ITopicBase | null;
  nextPart: ITopicBase | null;
  currentTurn: number;
  extraPoint: number;
  topic?: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const topicName = useSearchParams()?.get('topic');
  const [passing, setPassing] = useState(0);

  useEffect(() => {
    const handleFn = async () => {
      const passing = await calculatePassingApp();
      setPassing(passing);
    };
    handleFn();
  }, []);

  const navigateToHref = useCallback(
    ({ topicName, nextPart }: NavigateToHrefParams) => {
      dispatch(
        initLearnQuestionThunk({
          partId: nextPart.id,
          subTopicId: nextPart.parentId,
        })
      );
      const _href = `study/${topicName}?type=learn&subTopic=${nextPart.parentId}&partId=${nextPart.id}`;
      router.push(_href, {
        scroll: true,
      });
    },
    [dispatch, router]
  );

  const handleNextPart = useCallback(async () => {
    // if (nextPart && topicName) {
    //   dispatch(setIndexSubTopic(indexSubTopic + 1));
    //   dispatch(
    //     setTurtGame({
    //       turn: 1,
    //     })
    //   );
    //   dispatch(selectSubTopics(nextPart.parentId));
    //   navigateToHref({
    //     topicName,
    //     nextPart: nextPart,
    //   });
    //   return;
    // }
  }, [nextPart, navigateToHref, dispatch, topicName]);

  const handleTryAgainFn = useCallback(async () => {
    if (currentPart?.id) {
      await updateTurnTopic({
        id: currentPart.id,
      });
      await removeCompletedTest({
        id: currentPart.id,
      });
      const _href = `/${topic}?type=learn&partId=${currentPart.id}&turn=${
        currentTurn + 1
      }`;
      router.push(_href);
    }
  }, [currentPart, currentTurn, topicName, dispatch, router, topic]);

  const oldPassing = passing - extraPoint;
  const oldPassingRounded = Math.ceil(oldPassing);
  const passingRounded = Math.round(passing * 10) / 10;
  const extraPointRounded = Math.round(extraPoint * 10) / 10;

  return (
    <div className="flex w-full  flex-col justify-center items-center">
      <div className="w-full rounded-xl bg-[#7C6F5B] gap-6 items-center flex px-4 py-2 ">
        <div className="flex items-center flex-col sm:flex-row justify-start gap-2">
          <p className="text-xs sm:text-lg max-w-32 sm:max-w-72 text-center font-medium text-white">
            Passing Probability{' '}
          </p>
          <span className="text-2xl text-white">
            {Number.isInteger(passingRounded)
              ? passingRounded
              : passingRounded.toFixed(1)}{' '}
            %
          </span>
        </div>

        <div className="bg-white custom-progress rounded-lg h-9  flex-1 relative">
          <div className="w-full absolute p-2 inset-0 z-10">
            <progress
              value={extraPointRounded}
              max={extraPointRounded}
              className="rounded-lg"
              style={{
                width: `${extraPointRounded}%`,
              }}
            ></progress>
          </div>
          <div className="w-full absolute p-2  inset-0 z-20">
            <progress
              value={oldPassingRounded}
              max={oldPassingRounded}
              className=" rounded-lg"
              style={{
                width: `${oldPassingRounded}%`,
                background: '#12E1AF',
              }}
            ></progress>
          </div>

          <p className="absolute text-[#12E1AF] text-base right-2 top-0 bottom-0 flex items-center z-50">
            {' '}
            + {extraPointRounded} %
          </p>
        </div>
      </div>

      <div className="flex fixed sm:static bottom-0 left-0 z-20 bg-theme-white   sm:bg-transparent pb-8 sm:pb-2 px-4 pt-6 gap-4 max-w-[480px] w-full items-center">
        <MtUiButton
          className="text-primary bg-white border-primary"
          block
          size="large"
          onClick={handleTryAgainFn}
        >
          Try Again
        </MtUiButton>
        {/* {!isNextTopic && (
          <MtUiButton
            block
            size="large"
            onClick={handleNextPart}
            type="primary"
          >
            {isNextSubTopic ? 'Next Sub Topic' : 'Continue'}
          </MtUiButton>
        )} */}
      </div>
    </div>
  );
};

export default React.memo(PassingFinishPage);
