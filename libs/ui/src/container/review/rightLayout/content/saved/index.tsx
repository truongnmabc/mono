'use client';

import { Dialog } from '@mui/material';
import { MtUiButton } from '@ui/components/button';
import TabPanelReview from '@ui/container/result/tabPanelReview';
import { db } from '@ui/db';
import { IModeReview, ITopicHomeJson } from '@ui/models/other';
import { IQuestionOpt } from '@ui/models/question';
import { resetState, startRandomReview } from '@ui/redux/features/game';
import { mapQuestionsWithProgress } from '@ui/redux/repository/utils/handle';
import { useAppDispatch } from '@ui/redux/store';
import { generateRandomNegativeId } from '@ui/utils/math';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import ReviewGameContent from '../game';
import ChoiceQuestionBeforeStart from '../random/choiceQuestionBeforeStart';
const SavedQuestions = ({
  isMobile,
  mode,
}: {
  isMobile: boolean;
  isReady: boolean;
  mode: IModeReview;
  topics: ITopicHomeJson[];
}) => {
  const [listData, setListData] = React.useState<IQuestionOpt[]>([]);
  const [open, setOpen] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleGetData = async () => {
      dispatch(resetState());

      const reactions = await db?.useActions.toArray();

      if (reactions?.length) {
        const ids = reactions.map((item) => item.questionId);

        const [questions, progress] = await Promise.all([
          db?.questions.where('id').anyOf(ids).toArray(),
          db?.userProgress.toArray(),
        ]);

        const list = mapQuestionsWithProgress(
          questions || [],
          progress || []
        ) as IQuestionOpt[];

        setListData(list);
      }
    };
    handleGetData();
  }, []);

  const handleStartTest = useCallback(
    async (e: number) => {
      const maxQuestions = 100;
      const list = listData?.slice(0, Math.min(e, maxQuestions));
      const ques = list.map((i) => ({
        ...i,
        localStatus: 'new',
        selectedAnswer: null,
      }));
      const id = generateRandomNegativeId();

      dispatch(
        startRandomReview({
          listQuestion: ques,
          id,
        })
      );
      handleClose();
      setIsStart(true);
    },
    [handleClose, listData, dispatch]
  );

  return (
    <Fragment>
      <AnimatePresence initial={true} mode="wait">
        {isStart ? (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            key="test-ready"
            exit={{
              opacity: 0,
              y: -60,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full rounded-lg bg-white "
            style={{
              boxShadow: '0px 2px 4px 0px #2121211F',
            }}
          >
            <ReviewGameContent mode={mode} isMobile={isMobile} />
          </motion.div>
        ) : (
          <Fragment>
            <motion.div
              exit={{
                opacity: 0,
                x: 60,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <TabPanelReview
                data={listData}
                isMobile={isMobile}
                emptyMessage="You haven't added any questions to your saved list, try adding some then practice more."
              />
            </motion.div>
            {listData?.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                key="weak-ready"
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                }}
                transition={{
                  duration: 0.25,
                  ease: 'easeInOut',
                }}
                className=" fixed z-20 bottom-0 left-0 right-0 h-fit"
              >
                <div className="w-full h-full  py-4 bg-[#F9F7EE] flex items-center justify-center">
                  <MtUiButton
                    type="primary"
                    className="text-base px-10"
                    size="large"
                    onClick={handleOpen}
                  >
                    Let&apos;s Review
                  </MtUiButton>
                </div>
              </motion.div>
            )}
          </Fragment>
        )}
      </AnimatePresence>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: '900px',
            maxHeight: '240px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '12px',
          },
        }}
      >
        <p className="text-2xl pt-6 font-semibold text-center">
          How many questions do you want?
        </p>
        <ChoiceQuestionBeforeStart
          defaultValue={listData.length}
          handleStartTest={handleStartTest}
        />
      </Dialog>
    </Fragment>
  );
};

export default SavedQuestions;
