import { setAppConfig } from './features/appConfig';
import { selectAppConfig } from './features/appConfig.reselect';
import { setAppInfo, setIsDataFetched } from './features/appInfo';
import { selectAppInfo } from './features/appInfo.reselect';
import {
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
  shouldEndTimeTest,
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
  selectCurrentTopicId,
  selectEnableKeyboardShortcuts,
  selectGameDifficultyLevel,
  selectGameMode,
  selectHasRetakenDiagnosticTest,
  selectIsDataLoaded,
  selectIsGameCompleted,
  selectIsGamePaused,
  selectIsTimeUp,
  selectListQuestion,
  selectPassingThreshold,
  selectRemainingTime,
  selectTotalDuration,
} from './features/game.reselect';
import { paymentSuccessAction } from './features/payment';
import {
  selectInAppPurchasedInfo,
  selectPaymentInfo,
} from './features/payment.reselect';

import { selectSubTopics, selectTopics } from './features/study';

import { selectSubTopicsId, selectTopicsId } from './features/study.reselect';

import { shouldOpenSubmitTest } from './features/tests';

import {
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
import choiceAnswer from './repository/game/choiceAnswer/choiceAnswer';
import pauseTestThunk from './repository/game/pauseAndResumed/pauseTest';
import resumedTestThunk from './repository/game/pauseAndResumed/resumedTest';
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
  baseReducers,
  baseStore,
  beforeUnLoadThunk,
  choiceAnswer,
  continueGame,
  endTest,
  getListActionThunk,
  loginHybrid,
  logoutHybrid,
  pauseTestThunk,
  paymentSuccessAction,
  paymentSuccessThunk,
  resetState,
  resumedTestThunk,
  selectAppConfig,
  selectAppInfo,
  selectAttemptNumber,
  selectCurrentGame,
  selectCurrentQuestionIndex,
  selectCurrentSubTopicIndex,
  selectCurrentTopicId,
  selectEnableKeyboardShortcuts,
  selectGameDifficultyLevel,
  selectGameMode,
  selectHasRetakenDiagnosticTest,
  selectInAppPurchasedInfo,
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
  shouldEndTimeTest,
  shouldIsPro,
  shouldOpenModalLogin,
  shouldOpenSubmitTest,
  startCustomTest,
  startOverGame,
  startRandomReview,
  startTryAgainDiagnostic,
  updateFeedbackCustomTest,
  useAppDispatch,
  useAppSelector,
  userActionsThunk,
};
