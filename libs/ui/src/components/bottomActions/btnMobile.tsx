import { selectCurrentQuestionIndex } from '@ui/redux/features/game.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import React from 'react';
import { MtUiButton } from '../button';
import { shouldNextOrPreviousQuestion } from '@ui/redux/repository/game/nextQuestion/nextQuestions';

const BtnMobile = () => {
  const dispatch = useAppDispatch();

  const handleNavigate = (direction: 'prev' | 'next') => {
    dispatch(shouldNextOrPreviousQuestion(direction));
  };

  return (
    <div className="w-full flex items-center gap-4 sm:p-4 sm:w-fit">
      <BtnPrevious handleNavigate={handleNavigate} />
      <MtUiButton
        animated
        className="py-3 px-8 border-primary text-primary"
        block
        onClick={() => handleNavigate('next')}
        type="primary"
      >
        Next
      </MtUiButton>
    </div>
  );
};

export default React.memo(BtnMobile);

const BtnPrevious = ({
  handleNavigate,
}: {
  handleNavigate: (direction: 'prev' | 'next') => void;
}) => {
  const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);

  return (
    <MtUiButton
      animated
      className="py-3 px-8 border-primary bg-white text-primary"
      block
      onClick={() => handleNavigate('prev')}
      disabled={indexCurrentQuestion === 0}
    >
      Previous
    </MtUiButton>
  );
};
