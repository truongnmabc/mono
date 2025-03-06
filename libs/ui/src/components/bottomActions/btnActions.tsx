import { shouldOpenSubmitTest } from '@ui/redux/features/tests';
import nextQuestionActionThunk from '@ui/redux/repository/game/nextQuestion/nextGame';
import { useAppDispatch } from '@ui/redux/store';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';
import { IPropsBottomAction } from '.';
import { MtUiButton } from '../button';

interface GameResult {
  isCompleted?: boolean;
  resultId?: number;
  currentSubTopicIndex?: string;
  attemptNumber?: number;
}
type IThunkReturn = {
  payload: GameResult;
  type: string;
  meta: {
    requestId: string;
    requestStatus: 'fulfilled' | 'rejected';
  };
};

const WrapperBtnActions: React.FC<IPropsBottomAction> = ({
  type = 'learn',
  slug,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState({
    isDisabled: false,
    isFinish: false,
  });
  const handleFinish = async () => {
    try {
      setIsLoading(true);
      const { meta, payload } = (await dispatch(
        nextQuestionActionThunk()
      )) as unknown as IThunkReturn;
      if (meta.requestStatus === 'fulfilled') {
        setButtonState({
          isDisabled: false,
          isFinish: true,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(true));

  return (
    <Fragment>
      {type !== 'learn' && (
        <MtUiButton
          animated
          loading={isLoading}
          className="py-3 px-8 border-primary text-primary"
          block
          onClick={setOpenConfirm}
        >
          Submit
        </MtUiButton>
      )}
      <MtUiButton
        animated
        block
        onClick={handleFinish}
        disabled={buttonState.isFinish ? false : buttonState.isDisabled}
        loading={isLoading}
        type="primary"
        className="py-3 px-8"
      >
        Continue
      </MtUiButton>
    </Fragment>
  );
};

export default React.memo(WrapperBtnActions);
