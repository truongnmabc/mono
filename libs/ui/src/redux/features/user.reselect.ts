import { createSelector } from 'reselect';
import { userState } from './user';

export const selectUserInfo = createSelector(
  [userState],
  (userReducer) => userReducer.userInfo
);

export const selectOpenModalLogin = createSelector(
  [userState],
  (userReducer) => userReducer.shouldOpenLogin
);

export const selectListActions = createSelector(
  [userState],
  (userReducer) => userReducer.listActions
);

export const selectIsTester = createSelector(
  [userState],
  (userReducer) => userReducer.isTester
);
