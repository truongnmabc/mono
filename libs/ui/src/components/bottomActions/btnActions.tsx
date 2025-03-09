import { shouldOpenSubmitTest } from '@ui/redux/features/tests';
import nextQuestionActionThunk from '@ui/redux/repository/game/nextQuestion/nextGame';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useRouter } from 'next/navigation';
import React, { Fragment, useCallback, useState } from 'react';
import { IPropsBottomAction } from '.';
import { MtUiButton } from '../button';
import { selectCurrentGame, selectUserInfo } from '@ui/redux';
import queryString from 'query-string';
import RouterApp from '@ui/constants/router.constant';
import { TypeParam } from '@ui/constants';
import { IThunkFunctionReturn } from '@ui/models/other';
import dynamic from 'next/dynamic';
const ModalUnlock = dynamic(() => import('../modalUnlock'), {
  ssr: false,
});

interface GameResult {
  isDisabled?: boolean;
  resultId?: number;
  index?: string;
  attemptNumber?: number;
  isFinish?: boolean;
  shouldUpdatePro?: boolean;
  topic?: string;
}

const WrapperBtnActions: React.FC<IPropsBottomAction> = ({
  type = 'learn',
  slug,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const currentGame = useAppSelector(selectCurrentGame);
  const userInfo = useAppSelector(selectUserInfo);
  const isNotDisable = type === TypeParam.finalTests && userInfo.isPro;

  const handleFinish = useCallback(async () => {
    try {
      setIsLoading(true);
      const { meta, payload } = (await dispatch(
        nextQuestionActionThunk()
      )) as unknown as IThunkFunctionReturn<GameResult>;

      if (meta.requestStatus === 'fulfilled') {
        const {
          isFinish,
          shouldUpdatePro,
          resultId,
          attemptNumber,
          index,
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
        if (isFinish && type === TypeParam.learn) {
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
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router, slug, type]);

  const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(true));

  return (
    <Fragment>
      {type !== TypeParam.learn && (
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
        disabled={isNotDisable ? false : !currentGame.selectedAnswer}
        loading={isLoading}
        type="primary"
        className="py-3 px-8"
      >
        Continue
      </MtUiButton>
      {type === TypeParam.finalTests && (
        <ModalUnlock openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </Fragment>
  );
};

export default React.memo(WrapperBtnActions);
