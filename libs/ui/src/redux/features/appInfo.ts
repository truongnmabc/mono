import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppInfo, IAppInfo } from '@ui/models/app';
import { RootState } from '../store';

export interface IAppInfoReducer {
  appInfo: IAppInfo;
  isDataFetched: boolean;
  isStartAnimationNext: boolean;
  isStartAnimationPrevious: boolean;
}

const initApp = new AppInfo();
const initialState: IAppInfoReducer = {
  appInfo: initApp,
  isDataFetched: false,
  // false => Show , true :  Hidden
  isStartAnimationNext: false,
  // true => Show, false : Hidden
  isStartAnimationPrevious: true,
};
const appInfoSlice = createSlice({
  name: 'appInfo',
  initialState,
  reducers: {
    setAppInfo: (state, action: PayloadAction<IAppInfo>) => {
      state.appInfo = { ...action.payload };
    },
    setIsDataFetched: (state, action: PayloadAction<boolean>) => {
      state.isDataFetched = action.payload;
    },
    shouldEnableAnimation: (state) => {
      // state.isStartAnimationNext = !state.isStartAnimationNext;
      // state.isStartAnimationPrevious = !state.isStartAnimationPrevious;
    },
    setIsStartAnimationNext: (state, action: PayloadAction<boolean>) => {
      // state.isStartAnimationNext = action.payload;
    },
    setIsStartAnimationPrevious: (state, action: PayloadAction<boolean>) => {
      state.isStartAnimationPrevious = action.payload;
    },
  },
});
const { reducer: appInfoReducer, actions } = appInfoSlice;

export default appInfoReducer;

export const {
  setAppInfo,
  setIsDataFetched,
  shouldEnableAnimation,
  setIsStartAnimationNext,
  setIsStartAnimationPrevious,
} = actions;

export const appInfoState = (state: RootState) => state.appInfo;
