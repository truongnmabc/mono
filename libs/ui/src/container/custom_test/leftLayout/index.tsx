'use client';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@ui/redux/store';
import { selectGameDifficultyLevel } from '@ui/redux/features/game.reselect';
import { selectShouldOpenSetting } from '@ui/redux/features/tests.reselect';

import { ITopicHomeJson } from '@ui/models/other';
const AnswerSheet = dynamic(() => import('@ui/components/listLeftQuestions'), {
  ssr: false,
});
const GridLeftCustomTest = dynamic(() => import('../gridLeft'), {
  ssr: false,
});

const ModalSettingCustomTest = dynamic(() => import('../modalSetting'), {
  ssr: false,
});
const LeftLayout = ({
  isMobile,
  topics,
  testId,
}: {
  isMobile: boolean;
  topics: ITopicHomeJson[];
  testId: number;
}) => {
  return (
    <div className="  h-full flex-col gap-4 flex w-full">
      {!isMobile && <RenderAnswer />}
      {!isMobile && <GridLeftCustomTest testId={testId} />}
      <RenderPopupSetting topics={topics} />
    </div>
  );
};

export default LeftLayout;

const RenderAnswer = () => {
  const feedBack = useAppSelector(selectGameDifficultyLevel);
  return <AnswerSheet isActions={feedBack === 'exam'} />;
};

const RenderPopupSetting = ({ topics }: { topics: ITopicHomeJson[] }) => {
  const shouldOpenSetting = useAppSelector(selectShouldOpenSetting);

  if (!shouldOpenSetting.openModalSetting) return null;
  return <ModalSettingCustomTest topics={topics} {...shouldOpenSetting} />;
};
