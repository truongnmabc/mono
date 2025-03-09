'use client';
import { TypeParam } from '@ui/constants/index';
import RouterApp from '@ui/constants/router.constant';
import { IGameMode } from '@ui/models/tests/tests';
import {
  selectCurrentGame,
  selectEnableKeyboardShortcuts,
} from '@ui/redux/features/game.reselect';
import { IThunkFunctionReturn } from '@ui/models/other';
import nextQuestionActionThunk from '@ui/redux/repository/game/nextQuestion/nextGame';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import AnswerButton from '../answer';
import { MOCK_TEMP_LIST_ANSWER } from './mock';
import dynamic from 'next/dynamic';
import { shouldOpenSubmitTest } from '@ui/redux/features/tests';
const ModalUnlock = dynamic(() => import('../modalUnlock'), {
  ssr: false,
});
function shuffleArray<T>(array: T[]): T[] {
  if (array && array.length) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]]; // Hoán đổi vị trí
    }
    return copy;
  }
  return [];
}
interface GameResult {
  isDisabled?: boolean;
  resultId?: number;
  index?: string;
  turn?: number;
  isFinish?: boolean;
  shouldUpdatePro?: boolean;
  attemptNumber?: number;
  topic?: string;
}

type IProps = {
  isActions?: boolean;
  isBlockEnter?: boolean;
  type: IGameMode;
};
const ChoicesPanel: React.FC<IProps> = ({
  isActions = false,
  isBlockEnter = false,
  type,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const currentGame = useAppSelector(selectCurrentGame);
  const isListen = useAppSelector(selectEnableKeyboardShortcuts);

  const listRandomQuestion = useMemo(
    () =>
      currentGame?.answers?.length
        ? shuffleArray(currentGame.answers)
        : MOCK_TEMP_LIST_ANSWER,
    [currentGame?.answers]
  );
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const handleKeyboardEvent = async (event: globalThis.KeyboardEvent) => {
      if (currentGame?.answers && !currentGame.selectedAnswer) {
        const index = parseInt(event.key, 10);
        if (index >= 0 && index <= currentGame.answers.length) {
          document.getElementById(index.toString())?.click();
        }
      }

      if (event.key === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        if (currentGame.selectedAnswer) {
          const { meta, payload } = (await dispatch(
            nextQuestionActionThunk()
          )) as unknown as IThunkFunctionReturn<GameResult>;
          if (meta.requestStatus === 'fulfilled') {
            const {
              isFinish,
              shouldUpdatePro,
              resultId,
              index,
              attemptNumber,
              topic,
            } = payload;

            if (shouldUpdatePro) {
              setOpenModal(true);
              return;
            }
            if (isFinish && type !== TypeParam.learn) {
              dispatch(shouldOpenSubmitTest(true));
              return;
            }
            if (isFinish) {
              const params = queryString.stringify({
                resultId,
                attemptNumber,
                index: type === TypeParam.learn ? index : undefined,
                topic: type === TypeParam.learn ? topic : undefined,
                gameMode: type,
              });

              router.replace(`${RouterApp.Finish}?${params}`, { scroll: true });
            }
          }
        }
      }
    };
    if (!isBlockEnter && isListen) {
      document.addEventListener('keydown', handleKeyboardEvent);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent);
    };
  }, [isBlockEnter, currentGame, isListen, type]);

  return (
    <div className={'grid gap-2 grid-cols-1 sm:grid-cols-2'}>
      {listRandomQuestion?.map((choice, index) => (
        <AnswerButton
          choice={choice}
          index={index}
          key={choice?.id}
          isActions={isActions}
          currentGame={currentGame}
        />
      ))}

      {type === TypeParam.finalTests && (
        <ModalUnlock openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </div>
  );
};

export default ChoicesPanel;
