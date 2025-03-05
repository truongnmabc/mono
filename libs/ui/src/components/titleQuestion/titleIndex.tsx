'use client';
import { selectCurrentSubTopicIndex } from '@ui/redux/features/game.reselect';
import { useAppSelector } from '@ui/redux/store';

const TitleIndex = () => {
  const index = useAppSelector(selectCurrentSubTopicIndex);

  return <span>- Core {index + 1}</span>;
};

export default TitleIndex;
