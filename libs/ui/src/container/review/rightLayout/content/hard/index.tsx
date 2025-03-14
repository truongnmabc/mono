'use client';

import { IModeReview, ITopicHomeJson } from '@ui/models/other';
import {
  resetState,
  setCurrentTopicId,
  startRandomReview,
} from '@ui/redux/features/game';
import { useAppDispatch } from '@ui/redux/store';
import { genRandomQuestion } from '@ui/utils/data';
import { generateRandomNegativeId } from '@ui/utils/math';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useState } from 'react';
import ReviewGameContent from '../game';
import ChoiceQuestionBeforeStart from '../random/choiceQuestionBeforeStart';
import SheetSelectQuestions from '../sheet';

const HardQuestions = ({
  isMobile,
  mode,
  topics,
}: {
  isMobile: boolean;
  isReady: boolean;
  mode: IModeReview;
  topics: ITopicHomeJson[];
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(resetState());
  }, []);
  const [isStart, setIsStart] = useState(false);
  const handleStartTest = useCallback(
    async (value: number) => {
      const data = await genRandomQuestion({
        value: value,
        topics: topics,
        isHard: true,
      });
      const list = data?.slice(0, Math.min(value, 100));

      const id = generateRandomNegativeId();

      dispatch(
        startRandomReview({
          listQuestion: list,
          id,
        })
      );
      dispatch(setCurrentTopicId(id));
      setIsStart(true);
    },
    [dispatch]
  );
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full min-h-16">
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
            className="w-full rounded-lg bg-transparent sm:bg-white "
            style={{
              boxShadow: isMobile ? 'none' : '0px 2px 4px 0px #2121211F',
            }}
          >
            <ReviewGameContent mode={mode} isMobile={isMobile} />
          </motion.div>
        ) : (
          <Fragment>
            {isMobile ? (
              <SheetSelectQuestions
                handleBack={handleBack}
                handleStartTest={handleStartTest}
              />
            ) : (
              <motion.div
                key="test-not-ready"
                exit={{ opacity: 0, x: 60 }}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full rounded-lg bg-white "
                style={{
                  boxShadow: '0px 2px 4px 0px #2121211F',
                }}
              >
                <ChoiceQuestionBeforeStart
                  defaultValue={34}
                  handleStartTest={handleStartTest}
                />
              </motion.div>
            )}
          </Fragment>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HardQuestions;
