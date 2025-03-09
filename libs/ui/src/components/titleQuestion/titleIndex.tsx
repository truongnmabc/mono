'use client';
import { TypeParam } from '@ui/constants';
import { IGameMode } from '@ui/models/tests/tests';
import { selectCurrentSubTopicIndex } from '@ui/redux/features/game.reselect';
import { useAppSelector } from '@ui/redux/store';

const TitleIndex = ({ type }: { type?: IGameMode }) => {
  const index = useAppSelector(selectCurrentSubTopicIndex);

  return (
    <span>
      {type === TypeParam.learn ? '- Core' : ''} {Number(index) + 1}
    </span>
  );
};

export default TitleIndex;
