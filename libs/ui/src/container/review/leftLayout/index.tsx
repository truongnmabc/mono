import Grid2 from '@mui/material/Grid2';
import WrapperAnimationLeft from '@ui/container/study/mainStudyView/wrapperAnimationLeft';
import { IModeReview } from '@ui/models/other';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import AnswerReview from './answer';
import {
  IconAnsweredQuestion,
  IconHardQuestion,
  IconRandomQuestion,
  IconSavedQuestion,
  IconWeakQuestion,
} from './icon';
const LeftLayoutReview = ({
  isMobile,
  mode,
  isReady,
}: {
  isMobile: boolean;
  mode: IModeReview;
  isReady: boolean;
}) => {
  console.log('🚀 ~ isReady:', isReady);
  return (
    <Grid2
      size={{
        sm: 3,
        xs: 12,
      }}
      spacing={{
        xs: 0,
      }}
    >
      <WrapperAnimationLeft className="flex mt-4 flex-col gap-3">
        {<AnswerReview />}
        <p className="text-xl pt-2 sm:pt-0 text-center sm:text-start font-semibold">
          Review
        </p>
        <div className="flex flex-col gap-3">
          <ItemCard
            icon={<IconRandomQuestion />}
            title="Random Questions"
            des="Select questions randomly from the question bank."
            bg="#BAE8DB"
            type="random"
            selectType={mode}
            isReady={isReady}
          />{' '}
          <ItemCard
            icon={<IconWeakQuestion />}
            title="Weak Questions"
            des="Retake missed questions to improve your score."
            bg="#FFC7C7"
            selectType={mode}
            isReady={isReady}
            type="weak"
          />{' '}
          <ItemCard
            icon={<IconHardQuestion />}
            title="Hard Questions"
            des="Practice commonly answered incorrectly questions."
            bg="#D3F7FF"
            isReady={isReady}
            selectType={mode}
            type="hard"
          />{' '}
          <ItemCard
            icon={<IconSavedQuestion />}
            title="Saved Questions"
            des="Practice saved questions from lessons."
            isReady={isReady}
            bg="#FEEDD5"
            selectType={mode}
            type="saved"
          />{' '}
          <ItemCard
            icon={<IconAnsweredQuestion />}
            title="All Answered Questions"
            des="Revisit all questions you have previously attempted."
            isReady={isReady}
            bg="#DEEBFF"
            type="all"
            selectType={mode}
          />
        </div>
      </WrapperAnimationLeft>
    </Grid2>
  );
};

export default LeftLayoutReview;

type IItemCard = {
  icon: React.ReactNode;
  title: string;
  des: string;
  bg: string;
  type: IModeReview;
  selectType: IModeReview;
  isReady?: boolean;
};
const ItemCard: React.FC<IItemCard> = ({
  icon,
  title,
  des,
  bg,
  type,
  selectType,
  isReady,
}) => {
  return (
    <Link href={`/review?mode=${type}${isReady ? '&isReady=true' : ''}`}>
      <div
        className={clsx(
          'p-4 rounded-xl flex gap-3 cursor-pointer  bg-white border border-solid ',
          {
            'border-[#FC5656]': selectType === type,
          }
        )}
        style={{
          boxShadow: '0px 2px 4px 0px #2121211F',
        }}
      >
        <div
          className="rounded-2xl p-3 flex items-center justify-center"
          style={{
            background: bg,
          }}
        >
          <div className="w-[38px] h-[38px] flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden justify-between">
          <p className="text-base font-medium w-full truncate">{title}</p>
          <p className="text-xs font-normal text-[#21212199] line-clamp-2">
            {des}
          </p>
        </div>
      </div>
    </Link>
  );
};
