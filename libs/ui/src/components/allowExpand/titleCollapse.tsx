'use client';
import { Collapse } from '@mui/material';
import { ITopicHomeJson } from '@ui/models/other';
import { selectSubTopicsId } from '@ui/redux/features/study.reselect';
import selectSubTopicThunk from '@ui/redux/repository/study/select';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import ctx from '@ui/utils/twClass';
import clsx from 'clsx';
import React from 'react';
import LazyLoadImage from '../images';
import TopicLevelProgress from './topicLevelProgress';

const TitleCollapse = ({
  subTopic,
  topicId,
  isSelect,
}: {
  subTopic: ITopicHomeJson;
  topicId?: number;
  isSelect?: boolean;
}) => {
  const selectedSubTopics = useAppSelector(selectSubTopicsId);
  const isExpand = selectedSubTopics === subTopic.id;
  const dispatch = useAppDispatch();
  const titleRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="w-full transition-all h-full" ref={titleRef}>
      <div
        className={ctx(
          'w-full bg-[#F3F5F6] p-3  transition-all cursor-pointer flex gap-2 items-center justify-between',
          {
            'rounded-t-md': isExpand,
            'rounded-md': !isExpand,
          }
        )}
        onClick={() => {
          if (isExpand) {
            dispatch(selectSubTopicThunk(-1));
          } else {
            dispatch(selectSubTopicThunk(subTopic.id));
          }
        }}
      >
        <div className="flex flex-1 overflow-hidden gap-2 items-center">
          <div className="p-1 w-fit h-fit bg-white flex items-center justify-center rounded-md">
            <LazyLoadImage
              src={subTopic.icon}
              classNames="w-6 flex items-center justify-center h-6"
              imgClassNames="w-5 h-5"
              alt={subTopic.name}
              styles={{
                filter:
                  'brightness(0) saturate(100%) invert(8%) sepia(10%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)',
              }}
            />
          </div>

          <h4 className="text-xs flex-1 truncate overflow-hidden font-medium">
            {subTopic.name}
          </h4>
        </div>
        <div
          className={clsx('transition-all', {
            'rotate-180': isExpand,
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
        </div>
      </div>
      <Collapse in={isExpand} unmountOnExit timeout="auto">
        <TopicLevelProgress topicId={topicId} subTopic={subTopic} />
      </Collapse>
    </div>
  );
};

export default React.memo(TitleCollapse);
