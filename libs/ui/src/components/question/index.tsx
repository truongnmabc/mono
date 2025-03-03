'use client';
import LazyLoadImage from '@ui/components/images';
import MtUiSkeleton from '@ui/components/loading-skeleton';
import { baseImageUrl } from '@ui/constants/index';
import { useIsMobile } from '@ui/hooks/useIsMobile';
import { IGameMode } from '@ui/models/tests/tests';
import { selectAppInfo } from '@ui/redux/features/appInfo.reselect';
import {
  selectCurrentGame,
  selectCurrentQuestionIndex,
  selectListQuestion,
} from '@ui/redux/features/game.reselect';
import { useAppSelector } from '@ui/redux/store';
import { decrypt } from '@ui/utils/crypto';
import { MathJax } from 'better-react-mathjax';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import StatusAnswer from '../statusAnswer';

const QuestionContent = ({
  showStatus = true,
  showQuestionsCount = false,
  showShadow,
}: {
  showStatus?: boolean;
  showShadow?: boolean;
  showQuestionsCount?: boolean;
}) => {
  const currentGame = useAppSelector(selectCurrentGame);
  const appInfo = useAppSelector(selectAppInfo);
  const indexGame = useAppSelector(selectCurrentQuestionIndex);
  const list = useAppSelector(selectListQuestion);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const type = useSearchParams()?.get('type') as IGameMode;

  useEffect(() => {
    if (currentGame?.text && currentGame?.id) {
      try {
        const content = decrypt(currentGame?.text);
        setText(content);
      } catch (err) {
        console.log('🚀 ~ useEffect ~ err:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [currentGame?.id, currentGame?.text]);

  return (
    <div
      className={clsx(
        'w-full rounded-md p-3 min-h-8 flex flex-col gap-2 bg-white sm:bg-transparent relative py-2',
        {
          'shadow-custom sm:shadow-none': showShadow,
        }
      )}
    >
      {showStatus && isMobile && <StatusAnswer />}

      {loading && !text ? (
        <MtUiSkeleton className="min-h-8" />
      ) : (
        <Fragment>
          {(type === 'practiceTests' || showQuestionsCount) && (
            <div className="flex sm:hidden text-sm font-semibold">
              Question {indexGame + 1} / {list.length}
            </div>
          )}

          <div className="w-full flex items-center justify-between">
            <div className="flex-1">
              {text && (
                <MathJax dynamic>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: text,
                    }}
                    className="text-sm font-normal sm:text-base math-content"
                  />
                </MathJax>
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
          {currentGame.parentId !== -1 && (
            <MathJax dynamic>
              <div
                dangerouslySetInnerHTML={{
                  __html: currentGame.paragraph?.text || '',
                }}
                className="text-sm font-normal sm:text-base math-content"
              />
            </MathJax>
          )}
        </Fragment>
      )}
      {showStatus && !isMobile && <StatusAnswer />}
    </div>
  );
};

export default React.memo(QuestionContent);
