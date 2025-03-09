'use client';

import { ICurrentGame } from '@ui/models/game';
import { setCurrentQuestion } from '@ui/redux/features/game';
import {
  selectCurrentGame,
  selectCurrentQuestionIndex,
  selectListQuestion,
} from '@ui/redux/features/game.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import ctx from '@ui/utils/twClass';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React from 'react';

/**
 * Các thuộc tính (props) cho component.
 *
 * @typedef {Object} IProps
 * @property {boolean} [isActions] - Hiển thị trạng thái câu hỏi làm/chưa làm.
 * @property {boolean} [isCenter] - Căn giữa nội dung.
 * @property {string} [wrapperClassName] - Lớp CSS tùy chỉnh cho wrapper.
 */
type IProps = {
  isActions?: boolean;
  isCenter?: boolean;
  wrapperClassName?: string;
  defaultQuestionCount?: number;
  shouldUnlocked?: string;
};

const AnswerSheetFinal: React.FC<IProps> = ({
  defaultQuestionCount = 10,
  shouldUnlocked = 'true',
}) => {
  const listQuestion = useAppSelector(selectListQuestion);

  const defaultQuestions: ICurrentGame[] = React.useMemo(
    () =>
      Array(defaultQuestionCount).fill({
        id: '',
        localStatus: 'new',
      }),
    [defaultQuestionCount]
  );

  const displayQuestions = listQuestion?.length
    ? listQuestion
    : defaultQuestions;

  const currentGame = useAppSelector(selectCurrentGame);
  const indexCurrentGame = useAppSelector(selectCurrentQuestionIndex);
  const dispatch = useAppDispatch();

  const getClassNames = (q: ICurrentGame, index: number) =>
    ctx(
      'w-[30px] h-[30px] cursor-pointer text-xs rounded transition-all bg-white flex items-center justify-center border border-solid',
      {
        'border-red-500': q.localStatus === 'skip',
        'opacity-90 bg-white': q.localStatus === 'new',
        'border-[#5497FF] text-white bg-[#5497FF]': q.localStatus !== 'new',
        'border-[#5497FF] bg-white text-[#5497FF]': index === indexCurrentGame,
      }
    );

  return (
    <div
      className={ctx(
        'flex flex-col gap-3 dark:bg-black p-4 rounded-md bg-white'
      )}
    >
      <h3 className="font-semibold text-center text-xl truncate font-poppins">
        Questions
      </h3>
      <div className={clsx('flex gap-2 flex-wrap', {})}>
        {displayQuestions?.map((q, index) => (
          <motion.div
            key={index}
            className={getClassNames(q, index)}
            onClick={() => {
              if (shouldUnlocked === 'true' && currentGame?.id !== q.id)
                dispatch(setCurrentQuestion(index));
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.005 }}
          >
            {index + 1}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AnswerSheetFinal);
