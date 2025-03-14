import { TypeParam } from '@ui/constants';
import { IThunkFunctionReturn } from '@ui/models/other';
import { IGameMode } from '@ui/models/tests/tests';
import {
  selectCurrentGame,
  selectCurrentQuestionIndex,
} from '@ui/redux/features/game.reselect';
import { shouldNextOrPreviousQuestion } from '@ui/redux/repository/game/nextQuestion/nextQuestions';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { MtUiButton } from '../button';
const ModalUnlock = dynamic(() => import('../modalUnlock'), {
  ssr: false,
});
type GameResult = {
  isUnLock: boolean;
};

const BtnMobile = ({ type = 'learn' }: { type: IGameMode }) => {
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const currentGame = useAppSelector(selectCurrentGame);

  const handleNavigate = async (direction: 'prev' | 'next') => {
    const { meta, payload } = (await dispatch(
      shouldNextOrPreviousQuestion(direction)
    )) as IThunkFunctionReturn<GameResult>;
    if (meta.requestStatus === 'fulfilled' && payload.isUnLock) {
      setOpenModal(true);
    }
  };

  return (
    <div className="w-full flex items-center gap-4 sm:p-4 sm:w-fit">
      <BtnPrevious type={type} handleNavigate={handleNavigate} />
      <MtUiButton
        animated
        className="py-3 px-8 border-primary text-white"
        block
        onClick={() => handleNavigate('next')}
        type="primary"
        disabled={
          type === TypeParam.diagnosticTest
            ? !currentGame.selectedAnswer
            : false
        }
      >
        {type === TypeParam.finalTests ? 'Continue' : 'Next'}
      </MtUiButton>
      {type === TypeParam.finalTests && (
        <ModalUnlock openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </div>
  );
};

export default React.memo(BtnMobile);

const BtnPrevious = ({
  handleNavigate,
  type,
}: {
  handleNavigate: (direction: 'prev' | 'next') => void;
  type: IGameMode;
}) => {
  const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);

  return (
    <MtUiButton
      animated
      className="py-3 px-8 border-primary bg-white text-primary"
      block
      onClick={() => handleNavigate('prev')}
      disabled={type === TypeParam.diagnosticTest || indexCurrentQuestion === 0}
    >
      Previous
    </MtUiButton>
  );
};
