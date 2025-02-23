import appConfigReducer, { setAppConfig } from './features/appConfig';
import { selectAppConfig } from './features/appConfig.reselect';
import appInfoReducer, {
  setAppInfo,
  setIsDataFetched,
} from './features/appInfo';
import { selectAppInfo } from './features/appInfo.reselect';
import gameReducer, {
  continueGame,
  endTest,
  resetState,
  setCurrentGame,
  setCurrentQuestion,
  setCurrentTopicId,
  setIndexSubTopic,
  setListQuestionGames,
  setShouldListenKeyboard,
  setTurtGame,
  shouldCreateNewTest,
  shouldEndTimeTest,
  shouldLoading,
  startCustomTest,
  startOverGame,
  startRandomReview,
  startTryAgainDiagnostic,
  updateFeedbackCustomTest,
} from './features/game';

import {
  selectAttemptNumber,
  selectCurrentGame,
  selectCurrentQuestionIndex,
  selectCurrentSubTopicIndex,
  selectCurrentSubTopicProgressId,
  selectCurrentTopicId,
  selectEnableKeyboardShortcuts,
  selectGameDifficultyLevel,
  selectGameMode,
  selectHasRetakenDiagnosticTest,
  selectIsCreateNewTest,
  selectIsDataLoaded,
  selectIsGameCompleted,
  selectIsGamePaused,
  selectIsTimeUp,
  selectListQuestion,
  selectPassingThreshold,
  selectRemainingTime,
  selectShouldLoading,
  selectTotalDuration,
} from './features/game.reselect';
import paymentReducer, { paymentSuccessAction } from './features/payment';
import {
  selectInAppPurchasedInfo,
  selectPaymentInfo,
} from './features/payment.reselect';

import studyReducer, { selectSubTopics, selectTopics } from './features/study';

import { selectSubTopicsId, selectTopicsId } from './features/study.reselect';

import testReducer, { shouldOpenSubmitTest } from './features/tests';

import userReducer, {
  loginHybrid,
  logoutHybrid,
  setListReactions,
  shouldIsPro,
  shouldOpenModalLogin,
} from './features/user';

import {
  selectListActions,
  selectOpenModalLogin,
  selectUserInfo,
} from './features/user.reselect';
import choiceAnswer, {
  processChoiceAnswer,
} from './repository/game/choiceAnswer/choiceAnswer';
import choiceStartCustomTestThunk from './repository/game/choiceAnswer/choiceStartTest';
import finishCustomTestThunk from './repository/game/finish/finishCustomTest';
import finishDiagnosticThunk from './repository/game/finish/finishDiagnostic';
import finishFinalThunk from './repository/game/finish/finishFinal';
import finishPracticeThunk from './repository/game/finish/finishPracticeTest';
import finishQuestionThunk from './repository/game/finish/finishQuestion';
import initCustomTestThunk from './repository/game/initData/initCustomTest';
import initDiagnosticTestQuestionThunk from './repository/game/initData/initDiagnosticTest';
import initFinalTestThunk from './repository/game/initData/initFinalTest';
import initLearnQuestionThunk from './repository/game/initData/initLearningQuestion';
import initPracticeThunk from './repository/game/initData/initPracticeTest';
import nextQuestionThunk from './repository/game/nextQuestion/nextQuestion';
import nextQuestionDiagnosticThunk from './repository/game/nextQuestion/nextQuestionDiagnosticTest';
import nextQuestionFinalThunk from './repository/game/nextQuestion/nextQuestionFinalTest';
import pauseTestThunk from './repository/game/pauseAndResumed/pauseTest';
import resumedTestThunk from './repository/game/pauseAndResumed/resumedTest';
import { handleInitTestQuestion } from './repository/game/utils';
import paymentSuccessThunk from './repository/payment/paymentSuccess';
import userActionsThunk from './repository/user/actions';
import getListActionThunk from './repository/user/getActions';
import beforeUnLoadThunk from './repository/utils/reload';
import {
  baseReducers,
  baseStore,
  useAppDispatch,
  useAppSelector,
} from './store';
export {
  appConfigReducer,
  appInfoReducer,
  baseReducers,
  baseStore,
  beforeUnLoadThunk,
  choiceAnswer,
  choiceStartCustomTestThunk,
  continueGame,
  endTest,
  finishCustomTestThunk,
  finishDiagnosticThunk,
  finishFinalThunk,
  finishPracticeThunk,
  finishQuestionThunk,
  gameReducer,
  getListActionThunk,
  handleInitTestQuestion,
  initCustomTestThunk,
  initDiagnosticTestQuestionThunk,
  initFinalTestThunk,
  initLearnQuestionThunk,
  initPracticeThunk,
  loginHybrid,
  logoutHybrid,
  nextQuestionDiagnosticThunk,
  nextQuestionFinalThunk,
  nextQuestionThunk,
  pauseTestThunk,
  paymentReducer,
  paymentSuccessAction,
  paymentSuccessThunk,
  processChoiceAnswer,
  resetState,
  resumedTestThunk,
  selectAppConfig,
  selectAppInfo,
  selectAttemptNumber,
  selectCurrentGame,
  selectCurrentQuestionIndex,
  selectCurrentSubTopicIndex,
  selectCurrentSubTopicProgressId,
  selectCurrentTopicId,
  selectEnableKeyboardShortcuts,
  selectGameDifficultyLevel,
  selectGameMode,
  selectHasRetakenDiagnosticTest,
  selectInAppPurchasedInfo,
  selectIsCreateNewTest,
  selectIsDataLoaded,
  selectIsGameCompleted,
  selectIsGamePaused,
  selectIsTimeUp,
  selectListActions,
  selectListQuestion,
  selectOpenModalLogin,
  selectPassingThreshold,
  selectPaymentInfo,
  selectRemainingTime,
  selectShouldLoading,
  selectSubTopics,
  selectSubTopicsId,
  selectTopics,
  selectTopicsId,
  selectTotalDuration,
  selectUserInfo,
  setAppConfig,
  setAppInfo,
  setCurrentGame,
  setCurrentQuestion,
  setCurrentTopicId,
  setIndexSubTopic,
  setIsDataFetched,
  setListQuestionGames,
  setListReactions,
  setShouldListenKeyboard,
  setTurtGame,
  shouldCreateNewTest,
  shouldEndTimeTest,
  shouldIsPro,
  shouldLoading,
  shouldOpenModalLogin,
  shouldOpenSubmitTest,
  startCustomTest,
  startOverGame,
  startRandomReview,
  startTryAgainDiagnostic,
  studyReducer,
  testReducer,
  updateFeedbackCustomTest,
  useAppDispatch,
  useAppSelector,
  userActionsThunk,
  userReducer,
};
