'use client';
import LazyLoadImage from '@ui/components/images';
import { baseImageUrl } from '@ui/constants/index';
import { IAppInfo } from '@ui/models/app';
import { IGameMode } from '@ui/models/tests/tests';
import {
  selectCurrentGame,
  selectCurrentQuestionIndex,
  selectListQuestion,
} from '@ui/redux/features/game.reselect';
import { useAppSelector } from '@ui/redux/store';
import { decrypt } from '@ui/utils/crypto';
import { MathJax } from 'better-react-mathjax';
import clsx from 'clsx';
import { animate, motion, useMotionValue } from 'framer-motion';
import React, { Fragment, useEffect, useState } from 'react';
import StatusAnswer from '../statusAnswer';

export interface IAnimTextProps {
  texts: string;
  className?: string;
  delay?: number;
  animation?: boolean;
}
const QuestionContent = ({
  showStatus = true,
  showQuestionsCount = false,
  showShadow,
  type,
  appInfo,
  isMobile,
}: {
  showStatus?: boolean;
  showShadow?: boolean;
  showQuestionsCount?: boolean;
  type: IGameMode;
  appInfo: IAppInfo;
  isMobile: boolean;
}) => {
  const currentGame = useAppSelector(selectCurrentGame);

  return (
    <div
      className={clsx(
        'w-full rounded-md p-3 min-h-8 flex flex-col gap-2 bg-white sm:bg-transparent relative py-2',
        {
          'shadow-custom sm:shadow-none': showShadow,
        }
      )}
    >
      {showStatus && isMobile && (
        <StatusAnswer localStatus={currentGame?.localStatus} />
      )}

      <Fragment>
        {(type === 'practiceTests' || showQuestionsCount) && <SttText />}

        <div className="w-full flex items-center justify-between">
          <div className="flex-1 min-h-8">
            {currentGame?.text && (
              <AnimText
                key={currentGame?.text}
                animation={false}
                texts={decrypt(currentGame?.text)}
                className="text-sm font-normal sm:text-base transition-all duration-300 math-content"
              />
            )}
          </div>

          {currentGame?.image && (
            <div className="flex-shrink-0 ml-4">
              <LazyLoadImage
                key={currentGame?.image}
                isPreview
                src={`${baseImageUrl}${appInfo.appShortName}/images/${currentGame?.image}`}
                alt={currentGame?.image}
                classNames="w-16 sm:w-24 cursor-pointer aspect-video min-h-16 max-h-24"
              />
            </div>
          )}
        </div>
        {currentGame?.paragraph?.text && (
          <AnimText
            key={currentGame?.text}
            animation={false}
            texts={currentGame.paragraph?.text}
            className="text-sm font-normal sm:text-base math-content"
            delay={0.5}
          />
        )}
      </Fragment>
      {showStatus && !isMobile && (
        <StatusAnswer localStatus={currentGame?.localStatus} />
      )}
    </div>
  );
};

export default React.memo(QuestionContent);

function AnimText({ texts, className, delay = 0, animation }: IAnimTextProps) {
  const count = useMotionValue(0);
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    if (animation) {
      const controls = animate(count, texts.length, {
        type: 'tween',
        delay: delay,
        duration: 1,
        ease: 'easeInOut',

        onUpdate: (latest) => {
          setDisplayText(texts.slice(0, Math.round(latest)));
        },
      });
      return controls.stop;
    } else {
      setDisplayText(texts);
      return;
    }
  }, [texts]);

  return (
    <MathJax dynamic>
      <motion.span
        dangerouslySetInnerHTML={{
          __html: displayText,
        }}
        className={className}
      />
    </MathJax>
  );
}

const SttText = () => {
  const indexGame = useAppSelector(selectCurrentQuestionIndex);
  const list = useAppSelector(selectListQuestion);
  return (
    <div className="flex sm:hidden text-sm font-semibold">
      Question {indexGame + 1} / {list.length}
    </div>
  );
};
