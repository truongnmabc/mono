'use client';
import { ExpandMore } from '@mui/icons-material';
import { db } from '@shared-db';
import { ITopicBase } from '@shared-models/topics';
import { selectAppInfo } from '@shared-redux/features/appInfo.reselect';
import { setIndexSubTopic } from '@shared-redux/features/game';
import { selectSubTopics, selectTopics } from '@shared-redux/features/study';
import initQuestionThunk from '@shared-redux/repository/game/initData/initLearningQuestion';
import { useAppDispatch, useAppSelector } from '@shared-redux/store';
import { trackingEventGa4 } from '@shared-utils/googleEvent';
import { handleGetNextPart } from '@shared-utils/handleNavigateStudy';
import ctx from '@shared-utils/mergeClass';
import clsx from 'clsx';
import RouterApp from 'libs/constants/router.constant';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ListStudyDrawer = ({
  setOpenMenuDrawer,
}: {
  setOpenMenuDrawer: (e: boolean) => void;
}) => {
  const appInfo = useAppSelector(selectAppInfo);
  const [isExpand, setIsExpand] = useState(false);

  const [list, setList] = useState<ITopicBase[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleGetDataTopic = useCallback(async () => {
    const data = await db?.topics.toArray();
    if (data) setList(data);
  }, []);

  useEffect(() => {
    handleGetDataTopic();
  }, [handleGetDataTopic]);

  const handleClick = useCallback(
    async (topic: ITopicBase) => {
      trackingEventGa4({
        eventName: 'click_topic',
        value: {
          from: window.location.href,
          to: topic.tag,
        },
      });
      const { partId, subTopicId, allCompleted, currentIndex, turn } =
        await handleGetNextPart({
          topic,
        });
      if (!partId) {
        toast.error('Error: Không tìm thấy partId hợp lệ');
        return;
      }
      if (allCompleted) {
        router.push(
          `${RouterApp.Finish}?partId=${partId}&subTopicId=${subTopicId}&topic=${topic.tag}`
        );
        return;
      }
      const _href = `/study/${topic.tag}-practice-test?type=learn&partId=${partId}`;

      dispatch(selectTopics(topic.id));
      if (subTopicId) dispatch(selectSubTopics(subTopicId));
      dispatch(setIndexSubTopic(currentIndex + 1));

      if (partId) {
        dispatch(
          initQuestionThunk({
            partId,
            subTopicId,
            attemptNumber: turn,
          })
        );
      }
      setOpenMenuDrawer(false);
      router.push(_href);
    },
    [router, dispatch, setOpenMenuDrawer]
  );

  return (
    <div className="p-3">
      <div
        className="flex justify-start cursor-pointer gap-4 items-center"
        onClick={() => {
          setIsExpand(!isExpand);
        }}
      >
        <div className=" font-poppins text-2xl capitalize font-semibold">
          {appInfo.appShortName} Sub Test
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
          <div
            className="hover:bg-[#2121211f] relative overflow-hidden cursor-pointer"
            onClick={() => handleClick(item)}
            key={index}
          >
            <div className="p-2 text-lg">{item.name}</div>
            {index + 1 < list.length && (
              <div className="w-full h-[1px] bg-[#e4e4e4] "></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ListStudyDrawer);
