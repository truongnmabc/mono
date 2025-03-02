'use client';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import AllowExpandProvider from '@ui/components/allowExpand/provider';
import MtUiRipple, { useRipple } from '@ui/components/ripple';
import { ITopicHomeJson } from '@ui/models/other';
import { IGameMode } from '@ui/models/tests/tests';
import { selectTopics } from '@ui/redux/features/study';
import { selectTopicsId } from '@ui/redux/features/study.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { trackingEventGa4 } from '@ui/utils/event';
import ctx from '@ui/utils/twClass';
import React, { Fragment } from 'react';
import TitleCollapse from '../allowExpand/titleCollapse';
import { ITopicHomeProps } from '../home/gridTopic/gridTopics';
import LazyLoadImage from '../images';

const GridTopicLeft = ({
  appShortName,
  type,
  id,
  topics,
}: {
  appShortName: string;
  type?: IGameMode;
  id?: string;
  topics: ITopicHomeJson[];
}) => {
  const selectedTopics = useAppSelector(selectTopicsId);

  const [open, setOpen] = React.useState(type === 'learn');

  const handleOpen = () => setOpen(!open);
  const sortedTopics = topics.sort((a, b) => {
    if (String(a.id) === id) return -1; // Đưa testId lên đầu
    if (String(b.id) === id) return 1;
    return 0;
  });
  return (
    <div className="w-full flex flex-col gap-4">
      <div
        className="flex justify-between items-center w-full"
        onClick={handleOpen}
      >
        <h3 className="font-semibold text-xl font-poppins">
          More <span className="uppercase">{appShortName}</span> Topics
        </h3>
        {open ? <ExpandLess /> : <ExpandMore />}
      </div>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className="w-full flex flex-col gap-2">
          {sortedTopics?.map((subTopic, index) => (
            <Wrapper
              key={index}
              subTopic={subTopic}
              selectedTopics={selectedTopics}
              index={index}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default React.memo(GridTopicLeft);

const Wrapper = ({
  subTopic,
  selectedTopics,
  index,
}: {
  subTopic: ITopicHomeJson;
  selectedTopics: number;
  index: number;
}) => {
  const isAllowExpand = selectedTopics === subTopic.id;
  const dispatch = useAppDispatch();

  const {
    ripples,
    onClick: onRippleClickHandler,
    onClear: onClearRipple,
  } = useRipple();

  const handleClick: React.MouseEventHandler<HTMLDivElement> = async (e) => {
    onRippleClickHandler(e);
    trackingEventGa4({
      eventName: 'click_topic',
      value: {
        from: window.location.href,
        to: subTopic.slug,
      },
    });

    dispatch(selectTopics(isAllowExpand ? -1 : subTopic.id));
  };
  return (
    <Fragment key={index}>
      <div
        className={ctx(
          'flex items-center relative p-2 overflow-hidden rounded-md hover:border-primary bg-white h-[52px]  cursor-pointer w-full transition-all  border-solid border border-[#2121211F]'
        )}
        onClick={handleClick}
      >
        <div
          className={ctx(
            'rounded-md border-solid bg-primary-16 h-9 w-9 border-primary transition-all flex items-center rounded-tl-md  justify-center'
          )}
        >
          {subTopic.icon ? (
            <LazyLoadImage
              src={subTopic.icon}
              classNames="w-6 h-6"
              priority={false}
              styles={{
                filter:
                  'brightness(0) saturate(100%) invert(81%) sepia(50%) saturate(2746%) hue-rotate(336deg) brightness(100%) contrast(98%) ',
              }}
            />
          ) : (
            <div className="w-8 h-8"></div>
          )}
        </div>
        <h3 className=" pl-3  pr-2 flex-1 truncate font-medium text-xs">
          {subTopic.name}
        </h3>
        <MtUiRipple ripples={ripples} onClear={onClearRipple} />
      </div>
      <Collapse timeout="auto" unmountOnExit in={isAllowExpand}>
        <AllowExpandProvider topic={subTopic}>
          <div
            className={ctx('bg-white transition-all ', {
              'border mt-2 p-2  border-primary rounded-md rounded-br-md border-solid':
                isAllowExpand,
            })}
          >
            <div className="flex gap-2 flex-col ">
              {subTopic?.topics &&
                subTopic?.topics?.length > 0 &&
                subTopic?.topics?.map((subTopic, index) => (
                  <TitleCollapse subTopic={subTopic} key={index} />
                ))}
            </div>
          </div>
        </AllowExpandProvider>
      </Collapse>
    </Fragment>
  );
};
