import { setCurrentQuestion } from '@shared-redux/features/game';
import {
  selectCurrentGame,
  selectCurrentQuestionIndex,
  selectCurrentSubTopicProgressId,
  selectCurrentTopicId,
  selectGameDifficultyLevel,
  selectIsTimeUp,
  selectListQuestion,
} from '@shared-redux/features/game.reselect';
import { shouldOpenSubmitTest } from '@shared-redux/features/tests';
import finishQuestionThunk from '@shared-redux/repository/game/finish/finishQuestion';
import nextQuestionThunk from '@shared-redux/repository/game/nextQuestion/nextQuestion';
import nextQuestionDiagnosticThunk from '@shared-redux/repository/game/nextQuestion/nextQuestionDiagnosticTest';
import { useAppDispatch, useAppSelector } from '@shared-redux/store';
import RouterApp from 'libs/constants/router.constant';
import { useParams, useRouter } from 'next/navigation';
import React, { Fragment, useCallback, useMemo } from 'react';
import { IPropsBottomAction } from '.';
import { MtUiButton } from '../button';

const WrapperBtnActions: React.FC<IPropsBottomAction> = ({
  type = 'learn',
}) => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentGame = useAppSelector(selectCurrentGame);
  const subTopicProgressId = useAppSelector(selectCurrentSubTopicProgressId);
  const idTopic = useAppSelector(selectCurrentTopicId);
  const listQuestion = useAppSelector(selectListQuestion);
  const indexCurrentQuestion = useAppSelector(selectCurrentQuestionIndex);
  // console.log("🚀 ~ indexCurrentQuestion click:", indexCurrentQuestion);
  const isEndTimeTest = useAppSelector(selectIsTimeUp);
  const gameDifficultyLevel = useAppSelector(selectGameDifficultyLevel);

  const setOpenConfirm = () => dispatch(shouldOpenSubmitTest(true));

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

  const handleFinish = useCallback(() => {
    switch (type) {
      case 'finalTests':
        dispatch(setCurrentQuestion(indexCurrentQuestion + 1));
        break;
      case 'diagnosticTest':
        dispatch(nextQuestionDiagnosticThunk());
        break;
      case 'learn':
        if (isFinish) {
          dispatch(
            finishQuestionThunk({
              subTopicProgressId,
              topicId: idTopic,
            })
          );
          router.replace(
            `${RouterApp.Finish}?subTopicId=${subTopicProgressId}&topic=${params?.['slug']}&partId=${idTopic}`,
            { scroll: true }
          );
        } else {
          dispatch(nextQuestionThunk());
        }
        break;
      case 'practiceTests':
      case 'review':
      case 'customTets':
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
  }, [
    isFinish,
    dispatch,
    subTopicProgressId,
    idTopic,
    router,
    params,
    type,
    indexCurrentQuestion,
    gameDifficultyLevel,
  ]);

  return (
    <Fragment>
      {[
        'practiceTests',
        'finalTests',
        'diagnosticTest',
        'customTets',
        'review',
      ].includes(type) && (
        <MtUiButton
          animated
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
        type="primary"
        className="py-3 px-8"
      >
        Continue
      </MtUiButton>
    </Fragment>
  );
};

export default React.memo(WrapperBtnActions);
