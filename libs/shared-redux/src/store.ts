import { configureStore } from '@reduxjs/toolkit';
import appInfoReducer from './features/appInfo';
import appConfigReducer from './features/appConfig';
import studyReducer from './features/study';
import gameReducer from './features/game';
import userReducer from './features/user';
import testReducer from './features/tests';
import paymentReducer from './features/payment';

export const baseReducers = {
  appInfo: appInfoReducer,
  appConfig: appConfigReducer,
  study: studyReducer,
  game: gameReducer,
  test: testReducer,
  user: userReducer,
  payment: paymentReducer,
};

export const baseStore = () => {
  return configureStore({
    reducer: baseReducers,
  });
};

type AppStore = ReturnType<typeof baseStore>;

export type RootState = ReturnType<AppStore['getState']>;
