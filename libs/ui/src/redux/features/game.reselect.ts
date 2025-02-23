import { createSelector } from "reselect";
import { gameState } from "./game";

export const selectCurrentGame = createSelector(
    [gameState],
    (reducer) => reducer.currentGame
);

export const selectListQuestion = createSelector(
    [gameState],
    (reducer) => reducer.listQuestion
);

export const selectCurrentTopicId = createSelector(
    [gameState],
    (reducer) => reducer.currentTopicId
);

export const selectAttemptNumber = createSelector(
    [gameState],
    (reducer) => reducer.attemptNumber
);

export const selectCurrentQuestionIndex = createSelector(
    [gameState],
    (reducer) => reducer.currentQuestionIndex
);

export const selectCurrentSubTopicIndex = createSelector(
    [gameState],
    (reducer) => reducer.currentSubTopicIndex
);

export const selectTotalDuration = createSelector(
    [gameState],
    (reducer) => reducer.totalDuration
);

export const selectIsGamePaused = createSelector(
    [gameState],
    (reducer) => reducer.isGamePaused
);

export const selectGameMode = createSelector(
    [gameState],
    (reducer) => reducer.gameMode
);

export const selectGameDifficultyLevel = createSelector(
    [gameState],
    (reducer) => reducer.gameDifficultyLevel
);

export const selectCurrentSubTopicProgressId = createSelector(
    [gameState],
    (reducer) => reducer.currentSubTopicProgressId
);

export const selectIsGameCompleted = createSelector(
    [gameState],
    (reducer) => reducer.isGameCompleted
);

export const selectPassingThreshold = createSelector(
    [gameState],
    (reducer) => reducer.passingThreshold
);

export const selectRemainingTime = createSelector(
    [gameState],
    (reducer) => reducer.remainingTime
);

export const selectIsTimeUp = createSelector(
    [gameState],
    (reducer) => reducer.isTimeUp
);

export const selectEnableKeyboardShortcuts = createSelector(
    [gameState],
    (reducer) => reducer.enableKeyboardShortcuts
);

export const selectIsDataLoaded = createSelector(
    [gameState],
    (reducer) => reducer.isDataLoaded
);

export const selectHasRetakenDiagnosticTest = createSelector(
    [gameState],
    (reducer) => reducer.hasRetakenDiagnosticTest
);

export const selectShouldLoading = createSelector(
    [gameState],
    (reducer) => reducer.shouldLoading
);

export const selectIsCreateNewTest = createSelector(
    [gameState],
    (reducer) => reducer.isCreateNewTest
);
