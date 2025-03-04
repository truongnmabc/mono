import RouterApp from '@ui/constants/router.constant';
import { db } from '@ui/db';
import { setCurrentQuestion } from '@ui/redux/features/game';
import {
  selectAttemptNumber,
  selectCurrentGame,
  selectCurrentQuestionIndex,
  selectCurrentSubTopicIndex,
  selectCurrentSubTopicProgressId,
  selectCurrentTopicId,
  selectGameDifficultyLevel,
  selectIsTimeUp,
  selectListQuestion,
} from '@ui/redux/features/game.reselect';
import { shouldOpenSubmitTest } from '@ui/redux/features/tests';
import nextQuestionThunk from '@ui/redux/repository/game/nextQuestion/nextQuestion';
import nextQuestionDiagnosticThunk from '@ui/redux/repository/game/nextQuestion/nextQuestionDiagnosticTest';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { handleFinishTest } from '@ui/services/server/actions';
import { useParams, useRouter } from 'next/navigation';
import React, { Fragment, useMemo, useState } from 'react';
import { IPropsBottomAction } from '.';
import { MtUiButton } from '../button';

const WrapperBtnActions: React.FC<IPropsBottomAction> = ({
  type = 'learn',
  slug,
}) => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const turn = useAppSelector(selectAttemptNumber);
  const indexSubTopic = useAppSelector(selectCurrentSubTopicIndex);

  const currentGame = useAppSelector(selectCurrentGame);
  const subTopicProgressId = useAppSelector(selectCurrentSubTopicProgressId);
  const idTopic = useAppSelector(selectCurrentTopicId);
  const listQuestion = useAppSelector(selectListQuestion);
  const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);
  const isEndTimeTest = useAppSelector(selectIsTimeUp);
  const gameDifficultyLevel = useAppSelector(selectGameDifficultyLevel);

  const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(true));
  const [isLoading, setIsLoading] = useState(false);
  const isFinish =
    type === 'learn' &&
    listQuestion.every((item) => item.localStatus === 'correct');

  const listQuestionLength = listQuestion.length;

  const isDisabled = useMemo(() => {
    if (
      type !== 'learn' &&
      (indexCurrentQuestion === listQuestionLength - 1 || isEndTimeTest)
    )
      return true;
    if (gameDifficultyLevel === 'exam') return false;
    return (
      [
        'practiceTests',
        'learn',
        'diagnosticTest',
        'customTets',
        'review',
      ].includes(type) && !currentGame?.selectedAnswer
    );
  }, [
    currentGame,
    isEndTimeTest,
    type,
    indexCurrentQuestion,
    listQuestionLength,
    gameDifficultyLevel,
  ]);

  const handleFinish = async () => {
    try {
      setIsLoading(true);

      switch (type) {
        case 'finalTests':
          dispatch(setCurrentQuestion(indexCurrentQuestion + 1));
          break;
        case 'diagnosticTest':
          dispatch(nextQuestionDiagnosticThunk());
          break;
        case 'learn':
          if (isFinish) {
            const currentTopics = await db?.topics.get(idTopic);

            if (currentTopics) {
              await db?.topics
                .where('id')
                .equals(idTopic)
                .modify((topic) => {
                  topic.status = 1;
                });
            }

            await handleFinishTest(idTopic);
            router.replace(
              `${RouterApp.Finish}?topic=${slug}&resultId=${idTopic}&index=${currentTopics?.index}&turn=${currentTopics?.turn} `,
              { scroll: true }
            );
          } else {
            dispatch(nextQuestionThunk());
          }
          break;
        case 'practiceTests':
        case 'branchTest':
        case 'review':
        case 'customTests':
          if (gameDifficultyLevel === 'exam') {
            dispatch(setCurrentQuestion(indexCurrentQuestion + 1));
          } else {
            dispatch(nextQuestionThunk());
          }
          break;
        default:
          dispatch(nextQuestionThunk());
          break;
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      {[
        'branchTest',
        'practiceTests',
        'finalTests',
        'diagnosticTest',
        'customTets',
        'review',
      ].includes(type) && (
        <MtUiButton
          animated
          loading={isLoading}
          className="py-3 px-8 border-primary text-primary"
          block
          onClick={setOpenConfirm}
        >
          Submit
        </MtUiButton>
      )}
      <MtUiButton
        animated
        block
        onClick={handleFinish}
        disabled={isFinish ? false : isDisabled}
        loading={isLoading}
        type="primary"
        className="py-3 px-8"
      >
        Continue
      </MtUiButton>
    </Fragment>
  );
};

export default React.memo(WrapperBtnActions);
