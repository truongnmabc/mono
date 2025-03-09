'use client';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { MtUiButton } from '@ui/components/button';
import { continueGame, startOverGame } from '@ui/redux/features/game';
import {
  selectCurrentTopicId,
  selectIsGamePaused,
} from '@ui/redux/features/game.reselect';

import { updateTimeTest } from '@ui/redux/repository/game/pauseAndResumed/resumedTest';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { updateDbTestQuestions } from '@ui/utils/updateDb';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalConfirm = () => {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const testId = useSearchParams()?.get('testId');
  const dispatch = useAppDispatch();
  const isPaused = useAppSelector(selectIsGamePaused);
  const idTopic = useAppSelector(selectCurrentTopicId);

  const handleStartOver = useCallback(async () => {
    if (testId)
      await updateDbTestQuestions({
        id: Number(testId),
        data: {
          isGamePaused: false,
          elapsedTime: 0,
          status: 0,
        },
        isUpAttemptNumber: true,
      });
    if (pathname?.includes('diagnostic_test')) {
    }
    if (pathname?.includes('practice_test') && testId) {
    }
    dispatch(startOverGame());
    setOpen(false);
  }, [pathname, dispatch, testId]);

  const handleContinue = useCallback(() => {
    dispatch(updateTimeTest());
    dispatch(continueGame());
    setOpen(false);
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setOpen(false);
    });
    return () => {
      window.removeEventListener('popstate', () => {
        setOpen(false);
      });
    };
  }, [setOpen]);

  useEffect(() => {
    if (isPaused && idTopic) {
      setTimeout(() => setOpen(true), 200);
    }
  }, [isPaused, idTopic]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '12px',
        },
      }}
    >
      <div className=" p-6 rounded-xl max-w-[380px]  bg-[#F9F7EE]">
        <p className="text-lg font-medium text-center font-poppins">
          You are in the middle of this test. Do you want to continue?
        </p>

        <div className="mt-6 w-full flex items-center justify-between gap-4">
          <MtUiButton
            block
            className="text-base font-medium py-[10px] "
            onClick={handleStartOver}
            animated
          >
            Start over
          </MtUiButton>

          <MtUiButton
            className="text-base text-primary border-primary font-medium py-[10px] "
            block
            type="primary"
            animated
            onClick={handleContinue}
          >
            Continue
          </MtUiButton>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalConfirm;
