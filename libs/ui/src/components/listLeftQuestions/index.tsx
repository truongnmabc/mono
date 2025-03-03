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

const AnswerSheet: React.FC<IProps> = ({
  isActions = false,
  isCenter = false,
  wrapperClassName = 'bg-white',
  defaultQuestionCount = 10,
  shouldUnlocked = 'true',
}) => {
  const listQuestion = useAppSelector(selectListQuestion);

  // Tạo mảng default questions
  const defaultQuestions: ICurrentGame[] = React.useMemo(
    () =>
      Array(defaultQuestionCount).fill({
        id: '',
        localStatus: 'new',
      }),
    [defaultQuestionCount]
  );

  // Sử dụng listQuestion nếu có, ngược lại sử dụng defaultQuestions
  const displayQuestions = listQuestion?.length
    ? listQuestion
    : defaultQuestions;

  const currentGame = useAppSelector(selectCurrentGame);
  const indexCurrentGame = useAppSelector(selectCurrentQuestionIndex);
  const dispatch = useAppDispatch();

  const getClassNames = (q: ICurrentGame, index: number) =>
    ctx(
      'w-[30px] h-[30px] text-xs rounded transition-all bg-white flex items-center justify-center border border-solid',
      {
        'border-red-500': q.localStatus === 'skip',
        'border-[#07C58C] text-white bg-[#07C58C]':
          q.localStatus === 'correct' && !isActions,
        'border-[#FF746D] text-white bg-[#FF746D]':
          q.localStatus === 'incorrect' && !isActions,
        'opacity-90 bg-white': q.localStatus === 'new',
        'cursor-pointer': isActions,
        'cursor-not-allowed': !isActions,
        'border-[#5497FF] text-white bg-[#5497FF]':
          isActions && q.localStatus !== 'new',
        'border-[#5497FF] bg-white text-[#5497FF]':
          isActions && index === indexCurrentGame,
      }
    );

  return (
    <div
      className={ctx(
        'flex flex-col gap-3 dark:bg-black p-4 rounded-md',
        wrapperClassName
      )}
    >
      <h3 className="font-semibold text-center text-xl truncate font-poppins">
        Questions
      </h3>
      <div
        className={clsx('flex gap-2 flex-wrap', {
          'justify-center': isCenter,
        })}
      >
        {displayQuestions?.map((q, index) => (
          <motion.div
            key={index}
            className={getClassNames(q, index)}
            onClick={() => {
              if (
                shouldUnlocked === 'true' &&
                isActions &&
                currentGame?.id !== q.id
              )
                dispatch(setCurrentQuestion(index));
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {index + 1}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AnswerSheet);
