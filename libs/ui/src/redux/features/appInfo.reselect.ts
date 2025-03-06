import { createSelector } from 'reselect';
import { appInfoState } from './appInfo';

export const selectAppInfo = createSelector(
  [appInfoState],
  (appInfoReducer) => appInfoReducer.appInfo
);

export const selectIsDataFetched = createSelector(
  [appInfoState],
  (appInfoReducer) => appInfoReducer.isDataFetched
);

export const selectIsUnmount = createSelector(
  [appInfoState],
  (appInfoReducer) => appInfoReducer.isStartAnimationNext
);

export const selectIsUnmountPrevious = createSelector(
  [appInfoState],
  (appInfoReducer) => appInfoReducer.isStartAnimationPrevious
);
