import { createSelector } from 'reselect';
import { testState } from './tests';

export const selectOpenSubmitTest = createSelector(
  [testState],
  (testReducer) => testReducer.openSubmit
);

export const selectShouldOpenSetting = createSelector(
  [testState],
  (testReducer) => testReducer.shouldOpenSetting
);
