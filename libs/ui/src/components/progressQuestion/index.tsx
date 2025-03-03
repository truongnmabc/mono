import { selectListQuestion } from '@ui/redux/features/game.reselect';
import { useAppSelector } from '@ui/redux/store';

type IProps = {
  isActions?: boolean;
};

const ProgressQuestion: React.FC<IProps> = ({ isActions = false }) => {
  const listQuestion = useAppSelector(selectListQuestion);

  const total = listQuestion.length;

  const correctCount = listQuestion.filter(
    (q) => q.localStatus === 'correct'
  ).length;

  const incorrectCount = listQuestion.filter(
    (q) => q.localStatus === 'incorrect'
  ).length;

  const answeredCount = correctCount + incorrectCount;

  if (isActions) {
    return (
      <div className="sm:flex rounded-lg hidden overflow-hidden w-full h-2 relative">
        <div className="absolute top-0 left-0 h-full bg-[#21212133] w-full" />
        <div
          className="absolute top-0 left-0 h-full bg-[#21212185]
            transition-all duration-700 ease-out animate-progress-slide"
          style={{ width: `${(answeredCount / total) * 100}%` }}
        />
      </div>
    );
  }
  return (
    <div className="sm:flex rounded-lg hidden  w-full h-[6px] relative">
      <div className="study-progress  absolute bg-transparent rounded-2xl w-full z-10  top-0  left-0 h-[6px] ">
        <progress max={total} value={correctCount} />
      </div>
      <div className="study-progress-incorrect absolute bg-[#21212133]  rounded-2xl w-full z-0 top-0 left-0 h-[6px] ">
        <progress max={total} value={incorrectCount + correctCount} />
      </div>
    </div>
  );
};

export default ProgressQuestion;
