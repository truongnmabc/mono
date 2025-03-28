'use client';
import MtUiSkeleton from '@ui/components/loading-skeleton';
import { ICurrentGame } from '@ui/models/game';
import { IAnswer } from '@ui/models/question';
import choiceAnswer from '@ui/redux/repository/game/choiceAnswer/choiceAnswer';
import { useAppDispatch } from '@ui/redux/store';
import ctx from '@ui/utils/twClass';
import { MathJax } from 'better-react-mathjax';
import React, { useCallback } from 'react';
import GetIconPrefix from '../choicesPanel/getIcon';
import BtnTets from './btn';
const AnswerButton = ({
  choice,
  index,
  isActions,
  currentGame,
}: {
  choice: IAnswer;
  index: number;
  isActions?: boolean;
  currentGame: ICurrentGame;
}) => {
  const dispatch = useAppDispatch();

  const statusChoice =
    currentGame?.selectedAnswer &&
    ((currentGame?.selectedAnswer?.id === choice?.id && choice?.correct) ||
      choice.correct)
      ? 'pass'
      : (currentGame?.selectedAnswer?.id === choice?.id && !choice?.correct) ||
        currentGame.selectedAnswer?.id === -1
      ? 'miss'
      : 'other';

  const handleClick = useCallback(() => {
    if (
      currentGame?.selectedAnswer === null ||
      !currentGame?.selectedAnswer ||
      isActions
    ) {
      dispatch(
        choiceAnswer({
          question: currentGame,
          choice: choice,
        })
      );
    }
  }, [dispatch, isActions, currentGame, choice]);

  return (
    <div
      onClick={handleClick}
      className={ctx(
        'flex gap-2 w-full h-full bg-white sm:bg-transparent cursor-pointer items-center rounded-md border border-solid px-4 py-2 hover:bg-[#2121210a]',
        {
          'border-[#21212185]':
            isActions && currentGame?.selectedAnswer?.id === choice?.id,
          'border-[#07C58C]': statusChoice === 'pass' && !isActions,
          'border-[#FF746D]': statusChoice === 'miss' && !isActions,
          ' pointer-events-none': !isActions && currentGame?.selectedAnswer,
        }
      )}
      id={(index + 1).toString()}
    >
      <GetIconPrefix
        isActions={isActions}
        isSelect={currentGame?.selectedAnswer?.id === choice?.id}
        statusChoice={statusChoice}
      />

      {!choice.text ? (
        <MtUiSkeleton className="min-h-8 h-8 w-full" />
      ) : (
        <MathJax
          style={{
            fontSize: 14,
            lineHeight: 1.5,
            color: '#212121',
            padding: '8px 0',
          }}
          dynamic
          renderMode="post"
        >
          <span
            dangerouslySetInnerHTML={{
              __html: choice.text,
            }}
          />
        </MathJax>
      )}
      <BtnTets correct={choice.correct} />
    </div>
  );
};
export default React.memo(AnswerButton);
