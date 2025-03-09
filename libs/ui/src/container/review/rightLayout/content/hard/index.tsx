'use client';

import { useCallback, useEffect, useState } from 'react';
import ChoiceQuestionBeforeStart from '../random/choiceQuestionBeforeStart';
import { IModeReview } from '@ui/models/other';
import { ITopicHomeJson } from '@ui/models/other';
import { useAppDispatch } from '@ui/redux/store';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import ReviewGameContent from '../game';
import { startRandomReview, resetState } from '@ui/redux/features/game';
import { setCurrentTopicId } from '@ui/redux/features/game';
import { generateRandomNegativeId } from '@ui/utils/math';
import { genRandomQuestion } from '@ui/utils/data';

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
      const list = await genRandomQuestion({
        value: value,
        topics: topics,
        isHard: true,
      });
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
            className="w-full rounded-lg bg-white "
            style={{
              boxShadow: '0px 2px 4px 0px #2121211F',
            }}
          >
            <ReviewGameContent mode={mode} isMobile={isMobile} />
          </motion.div>
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
      </AnimatePresence>
    </div>
  );
};

export default HardQuestions;
