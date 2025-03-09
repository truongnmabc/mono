import { Dialog } from '@mui/material';
import { MtUiButton } from '@ui/components/button';
import RouterApp from '@ui/constants/router.constant';
import { useIsMobile } from '@ui/hooks/useIsMobile';
import { IGameMode } from '@ui/models/tests/tests';
import { selectListQuestion } from '@ui/redux/features/game.reselect';
import { shouldOpenSubmitTest } from '@ui/redux/features/tests';
import submitTestThunk from '@ui/redux/repository/game/submit/submitTest';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
const Sheet = dynamic(() => import('@ui/components/sheet'), {
  ssr: false,
});

const Content = ({
  info,
  setCloseConfirm,
  handleConfirm,
}: {
  setCloseConfirm: () => void;
  handleConfirm: () => void;
  info: {
    answer: number;
    total: number;
  };
}) => {
  return (
    <div className="w-full p-4 gap-4 sm:p-0  sm:px-20 sm:py-6 bg-[#F9F7EE] flex items-center flex-col sm:flex-row justify-between">
      <div className="w-full">
        {info.answer !== info.total && (
          <p className="text-base px-1 pb-2 sm:pb-0 sm:px-0 text-center sm:text-start sm:text-2xl font-medium">
            You answered {info.answer} out of {info.total} questions on this
            test.
          </p>
        )}
        <p className="text-sm text-[#21212185] sm:text-base text-center sm:text-start  font-normal">
          Are you sure you want to submit the test?
        </p>
      </div>
      <div className="flex gap-3 sm:gap-6 items-center">
        <MtUiButton className="text-base px-10" onClick={setCloseConfirm}>
          Cancel
        </MtUiButton>
        <MtUiButton
          type="primary"
          className="text-base px-10"
          onClick={handleConfirm}
        >
          Submit
        </MtUiButton>
      </div>
    </div>
  );
};

interface GameResult {
  resultId?: number;
  attemptNumber?: number;
  gameMode?: IGameMode;
}
type InitDataGameReturn = {
  payload: GameResult;
  type: string;
  meta: {
    requestId: string;
    requestStatus: 'fulfilled' | 'rejected';
  };
};

const ContentBottomConfirm = () => {
  const dispatch = useAppDispatch();
  const [shouldOpenSubmit, setShouldOpenSubmit] = useState(true);
  const isMobile = useIsMobile();
  const listQuestions = useAppSelector(selectListQuestion);
  const router = useRouter();

  const setCloseConfirm = useCallback(() => {
    setShouldOpenSubmit(false);
    setTimeout(() => {
      dispatch(shouldOpenSubmitTest(false));
    }, 250);
  }, [dispatch]);

  const handleConfirm = useCallback(async () => {
    const result = (await dispatch(
      submitTestThunk()
    )) as unknown as InitDataGameReturn;

    if (result.meta?.requestStatus === 'fulfilled') {
      const { resultId, attemptNumber, gameMode } = result.payload;
      const param = queryString.stringify({
        resultId,
        attemptNumber,
        gameMode,
      });
      setCloseConfirm();
      setTimeout(() => {
        router.replace(`${RouterApp.ResultTest}?${param}`);
      }, 250);
    }
  }, [dispatch, router, setCloseConfirm]);

  if (isMobile) {
    return (
      <Dialog
        open={shouldOpenSubmit}
        onClose={setCloseConfirm}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
          },
        }}
      >
        <Content
          handleConfirm={handleConfirm}
          setCloseConfirm={setCloseConfirm}
          info={{
            answer: listQuestions.filter((item) => item.selectedAnswer).length,
            total: listQuestions.length,
          }}
        />
      </Dialog>
    );
  }
  return (
    <div className="zaui-sheet-content-border-none">
      <Sheet
        mask
        maskClosable
        visible={shouldOpenSubmit}
        onClose={setCloseConfirm}
        autoHeight
        unmountOnClose
        handler={false}
      >
        <Content
          handleConfirm={handleConfirm}
          setCloseConfirm={setCloseConfirm}
          info={{
            answer: listQuestions.filter((item) => item.selectedAnswer).length,
            total: listQuestions.length,
          }}
        />
      </Sheet>
    </div>
  );
};

export default ContentBottomConfirm;
