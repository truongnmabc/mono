'use client';
import { selectListQuestion } from '@ui/redux/features/game.reselect';
import { useAppSelector } from '@ui/redux/store';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

const AnswerReview = ({ isActions = false }) => {
  const listQuestion = useAppSelector(selectListQuestion);
  return (
    <AnimatePresence initial={true} mode="wait">
      {listQuestion.length > 0 && (
        <motion.div
          initial={{
            opacity: 0,
            x: -60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -60,
          }}
          transition={{
            duration: 0.25,
            ease: 'easeInOut',
          }}
          className={clsx(
            'bg-white sm:mt-9  flex-col gap-3 dark:bg-black p-4 rounded-md'
          )}
        >
          <h3 className="font-semibold text-center text-xl truncate font-poppins">
            Questions
          </h3>
          <div className="flex gap-2 justify-center  flex-wrap ">
            {listQuestion?.map((q, index) => {
              return (
                <div
                  key={index}
                  className={clsx(
                    'w-[30px] h-[30px]  text-xs rounded transition-all flex items-center justify-center border border-solid',
                    {
                      'border-red-500': q.localStatus === 'skip',

                      'border-[#07C58C] text-white bg-[#07C58C]':
                        q.localStatus === 'correct' && !isActions,
                      'border-[#FF746D] text-white bg-[#FF746D]':
                        q.localStatus === 'incorrect' && !isActions,
                      'opacity-90': q.localStatus === 'new',
                      'cursor-pointer': isActions,
                      'border-[#5497FF] text-white bg-[#5497FF]':
                        isActions && q.localStatus !== 'new',
                    }
                  )}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnswerReview;
