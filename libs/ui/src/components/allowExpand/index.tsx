'use client';
import { Collapse } from '@mui/material';
import { ITopicBase } from '@ui/models/topics';
import { selectTopicsId } from '@ui/redux/features/study.reselect';
import { useAppSelector } from '@ui/redux/store';
import { detectAgent } from '@ui/utils/device';
import ctx from '@ui/utils/twClass';
import RouterApp from '@ui/constants/router.constant';
import { usePathname } from 'next/navigation';
import React, { useContext } from 'react';
import { AllowExpandContext, IContextAllowExpand } from './provider';
import TitleCollapse from './titleCollapse';
const AllowExpand = () => {
  const pathname = usePathname();
  const { mainTopic } = useContext<IContextAllowExpand>(AllowExpandContext);
  const selectedTopics = useAppSelector(selectTopicsId);
  const isAllowExpand = selectedTopics === mainTopic?.id;
  const { isMobile } = detectAgent(navigator.userAgent);

  const open =
    !isMobile && pathname === RouterApp.Home
      ? false
      : selectedTopics === mainTopic?.id;
  return (
    <Collapse timeout="auto" unmountOnExit in={open}>
      <div
        className={ctx('bg-white transition-all ', {
          'border p-2 border-t-0 border-primary rounded-bl-md rounded-br-md border-solid':
            isAllowExpand && pathname === RouterApp.Home,
          ' rounded-md': pathname !== RouterApp.Home,
        })}
      >
        <div className="flex gap-2 flex-col ">
          {mainTopic?.topics &&
            mainTopic?.topics?.length > 0 &&
            mainTopic?.topics?.map((subTopic: ITopicBase, index: number) => (
              <TitleCollapse subTopic={subTopic} key={index} />
            ))}
        </div>
      </div>
    </Collapse>
  );
};

export default React.memo(AllowExpand);
