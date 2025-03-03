// 'use client';
// import LazyLoadImage from '@ui/components/images';
// import { ICurrentGame } from '@ui/models/game';
// import { gameState } from '@ui/redux/features/game';
// import { useAppSelector } from '@ui/redux/store';

// const EmotionComponent = () => {
//   const { currentGame } = useAppSelector(gameState);
//   console.log('🚀 ~ EmotionComponent ~ currentGame:', currentGame);

//   const percentUser = getPercentUser(currentGame);

//   if (currentGame?.selectedAnswer) {
//     return (
//       <div className="flex  justify-center relative gap-[10px] items-center">
//         {/* {isCorrect ? <CongratsAnim /> : null} */}

//         <div className="w-10 h-10">
//           {currentGame.selectedAnswer?.correct && (
//             <LazyLoadImage
//               classNames="w-10 h-10"
//               src="/images/icon-congrat/happy.png"
//               data-src="/images/icon-congrat/happy.png"
//               data-srcset="/images/icon-congrat/happy.png"
//               alt="Emotion Face"
//             />
//           )}
//           {!currentGame.selectedAnswer?.correct && (
//             <LazyLoadImage
//               classNames="w-10 h-10"
//               src="/images/icon-congrat/sad.png"
//               data-src="/images/icon-congrat/sad.png"
//               data-srcset="/images/icon-congrat/sad.png"
//               alt="Emotion Face"
//             />
//           )}
//         </div>
//         <p className="font-medium text-xs sm:text-lg text-[#587CDA]">
//           {!currentGame.selectedAnswer?.correct
//             ? 'Oops! You are one of ' +
//               percentUser +
//               "% of test-takers missed this question. Let's move on!"
//             : 'Congrats! You are one of ' +
//               (100 - percentUser) +
//               "% of test-takers correctly got this question. Let's move on!"}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// // /** fake dữ liệu */
// const getPercentUser = (question: ICurrentGame) => {
//   if (!question) return 0;
//   const dif = question?.level === -1 ? 2 : question.level < 50 ? 1 : 3;
//   let per = question.id % 100;
//   if (dif == 1) {
//     while (per > 30) {
//       per -= 10;
//     }
//   } else if (dif == 2) {
//     if (per > 60) {
//       while (per > 60) {
//         per -= 10;
//       }
//     } else if (per < 40) {
//       while (per < 40) {
//         per += 10;
//       }
//     }
//   } else if (dif == 3) {
//     while (per < 60) {
//       per += 10;
//     }
//   }
//   return per;
// };
// export default EmotionComponent;

'use client';

import LazyLoadImage from '@ui/components/images';
import { ICurrentGame } from '@ui/models/game';
import { gameState } from '@ui/redux/features/game';
import { useAppSelector } from '@ui/redux/store';
import { motion } from 'framer-motion';

const EmotionComponent = () => {
  const { currentGame } = useAppSelector(gameState);

  const percentUser = getPercentUser(currentGame);

  if (!currentGame?.selectedAnswer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex justify-center relative gap-[10px] items-center"
    >
      {/* Hiển thị Icon cảm xúc */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-10 h-10"
      >
        {currentGame.selectedAnswer?.correct ? (
          <LazyLoadImage
            classNames="w-10 h-10"
            src="/images/icon-congrat/happy.png"
            alt="Happy Face"
          />
        ) : (
          <LazyLoadImage
            classNames="w-10 h-10"
            src="/images/icon-congrat/sad.png"
            alt="Sad Face"
          />
        )}
      </motion.div>

      {/* Hiển thị Văn bản phản hồi */}
      <motion.p
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="font-medium text-xs sm:text-lg text-[#587CDA]"
      >
        {currentGame.selectedAnswer?.correct
          ? ` Congrats! You are one of ${
              100 - percentUser
            }%  of test-takers correctly got this question. Let's move on!`
          : `Oops! You are one of ${percentUser}% of test-takers missed this question. Let's move on!`}
      </motion.p>
    </motion.div>
  );
};

// Hàm giả lập dữ liệu
const getPercentUser = (question: ICurrentGame) => {
  if (!question) return 0;
  const dif = question?.level === -1 ? 2 : question.level < 50 ? 1 : 3;
  let per = question.id % 100;
  if (dif === 1) {
    while (per > 30) per -= 10;
  } else if (dif === 2) {
    if (per > 60) while (per > 60) per -= 10;
    else if (per < 40) while (per < 40) per += 10;
  } else if (dif === 3) {
    while (per < 60) per += 10;
  }
  return per;
};

export default EmotionComponent;
