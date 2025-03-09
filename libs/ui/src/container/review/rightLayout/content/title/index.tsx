'use client';
import { IModeReview } from '@ui/models/other';
import { selectListQuestion } from '@ui/redux/features/game.reselect';
import { useAppSelector } from '@ui/redux/store';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const TitleReview = ({ mode }: { mode: IModeReview; isReady: boolean }) => {
  const titles: Record<string, string> = {
    random: 'How many questions do you want?',
    hard: 'How many questions do you want?',
    weak: 'Weak Questions',
    saved: 'Saved Questions',
    all: 'All Answered Questions',
  };

  const listQuestion = useAppSelector(selectListQuestion);
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.025, duration: 0.1 }, // Từng chữ xuất hiện sau 0.05s
    }),
  };
  return (
    <div className="w-full h-full min-h-8 flex items-center justify-center">
      <AnimatePresence initial={true} mode="wait">
        {listQuestion.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <motion.h1
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                duration: 0.5,
                ease: 'easeInOut',
              }}
              className="text-2xl text-nowrap font-semibold"
            >
              {titles[mode].split('').map((char, i) => (
                <motion.span key={i} custom={i} variants={titleVariants}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(TitleReview);
