import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';
import appConfigReducer from './features/appConfig';
import appInfoReducer from './features/appInfo';
import gameReducer from './features/game';
import paymentReducer from './features/payment';
import studyReducer from './features/study';
import testReducer from './features/tests';
import userReducer from './features/user';

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

export type AppStore = ReturnType<typeof baseStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
