import { Modal } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import XIcon from '@ui/asset/icon/XIcon';
import { db } from '@ui/db';
import {
  choiceAnswer,
  selectCurrentGame,
  selectListQuestion,
  selectUserInfo,
  shouldOpenSubmitTest,
} from '@ui/redux';
import { clearIsPro, shouldIsPro } from '@ui/redux/features/user';
import { syncDown } from '@ui/redux/repository/sync/syncDown';
import { syncUp } from '@ui/redux/repository/sync/syncUp';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useClearIsProServer, useSetIsProServer } from '@ui/services/actions';
import { Fragment, useState } from 'react';
import { MtUiButton } from '../button';
import nextQuestionActionThunk from '@ui/redux/repository/game/nextQuestion/nextGame';
import { IThunkFunctionReturn } from '@ui/models/other';
import { TypeParam } from '@ui/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import RouterApp from '@ui/constants/router.constant';
import ModalUnlock from '@ui/components/modalUnlock';
interface GameResult {
  isDisabled?: boolean;
  resultId?: number;
  index?: string;
  attemptNumber?: number;
  isFinish?: boolean;
  shouldUpdatePro?: boolean;
  topic?: string;
}
export const ModalTestMode = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const listQuestion = useAppSelector(selectListQuestion);
  const modes = [
    { label: 'All Correct', value: 'correct' },
    { label: 'All Incorrect', value: 'incorrect' },
    { label: 'Random', value: 'random' },
  ];
  const user = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const handleGetPro = async () => {
    dispatch(shouldIsPro());
    useSetIsProServer();
  };
  const [openModal, setOpenModal] = useState(false);

  const handleClearPro = async () => {
    useClearIsProServer();
    dispatch(clearIsPro());
  };

  const handleSyncUp = async () => {
    dispatch(syncUp({}));
  };
  const handleSyncDown = async () => {
    const app = await db?.passingApp.get(-1);
    dispatch(
      syncDown({
        syncKey: app?.syncKey || '',
      })
    );
  };

  const type = useSearchParams().get('type');
  const router = useRouter();
  const handleStartTest = async () => {
    setShowModal(false);

    const processQuestion = async (index: number): Promise<void> => {
      if (index >= listQuestion.length) return;

      const question = listQuestion[index];
      let chosenAnswer;

      if (selectedMode === 'correct') {
        chosenAnswer = question.answers.find((a) => a.correct);
      } else if (selectedMode === 'incorrect') {
        chosenAnswer = question.answers.find((a) => !a.correct);
      } else if (selectedMode === 'random') {
        const index = Math.floor(Math.random() * 4);
        chosenAnswer = question.answers[index];
      }

      if (!chosenAnswer) {
        console.warn(
          `Không tìm thấy đáp án cho câu hỏi ${question.id} với chế độ ${selectedMode}`
        );
        await processQuestion(index + 1);
        return;
      }

      dispatch(
        choiceAnswer({
          question: question,
          choice: chosenAnswer,
        })
      );

      const { meta, payload } = (await dispatch(
        nextQuestionActionThunk()
      )) as unknown as IThunkFunctionReturn<GameResult>;

      if (meta.requestStatus === 'fulfilled') {
        const {
          isFinish,
          shouldUpdatePro,
          resultId,
          index,
          attemptNumber,
          topic,
        } = payload;

        if (shouldUpdatePro) {
          setOpenModal(true);
          return;
        }
        if (isFinish && type !== TypeParam.learn) {
          dispatch(shouldOpenSubmitTest(true));
          return;
        }
        if (isFinish) {
          const params = queryString.stringify({
            resultId,
            attemptNumber,
            index: type === TypeParam.learn ? index : undefined,
            topic: type === TypeParam.learn ? topic : undefined,
            gameMode: type,
          });

          router.replace(`${RouterApp.Finish}?${params}`, { scroll: true });
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 200));

      await processQuestion(index + 1);
    };

    // Bắt đầu từ câu hỏi đầu tiên (index 0)
    await processQuestion(0);
  };

  return (
    <Fragment>
      {/* Button mở Modal */}
      <div
        className="fixed z-50 bottom-32 bg-white rounded-full p-2 right-8 cursor-pointer shadow-md"
        onClick={() => setShowModal(true)}
      >
        <XIcon />
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="absolute flex flex-col gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl text-center font-semibold">Test Settings</h2>
          <p className="text-center text-sm text-gray-600">
            Select a test mode to start
          </p>

          {/* List Options */}
          <div className="flex flex-col">
            {modes.map((mode) => (
              <label
                key={mode.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100  rounded transition"
              >
                <Checkbox
                  checked={selectedMode === mode.value}
                  onChange={() => setSelectedMode(mode.value)}
                />
                <span className="text-base">{mode.label}</span>
              </label>
            ))}
          </div>
          <div className="w-full flex items-center justify-center gap-3">
            <MtUiButton block onClick={handleSyncUp}>
              Sync Up
            </MtUiButton>
            <MtUiButton block onClick={handleSyncDown}>
              Sync Down
            </MtUiButton>
          </div>
          <div className="w-full flex items-center justify-center gap-3">
            <MtUiButton
              onClick={handleGetPro}
              type={user.isPro ? 'primary' : 'default'}
              block
            >
              {' '}
              Upgrade Pro
            </MtUiButton>

            <MtUiButton
              onClick={handleClearPro}
              block
              type={!user.isPro ? 'primary' : 'default'}
            >
              {' '}
              Clear Pro
            </MtUiButton>
          </div>

          {/* Buttons */}
          <div className="flex items-center w-full justify-center gap-3">
            <MtUiButton block onClick={() => setShowModal(false)}>
              Close
            </MtUiButton>
            <MtUiButton
              block
              type="primary"
              disabled={!selectedMode}
              onClick={handleStartTest}
            >
              Start
            </MtUiButton>
          </div>
        </div>
      </Modal>
      <ModalUnlock openModal={openModal} setOpenModal={setOpenModal} />
    </Fragment>
  );
};
