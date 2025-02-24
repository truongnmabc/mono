import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppInfo, IAppInfo } from '@ui/models/app';
import { RootState } from '../store';

export interface IAppInfoReducer {
  appInfo: IAppInfo;
  isDataFetched: boolean;
}

const initApp = new AppInfo();
const initialState: IAppInfoReducer = {
  appInfo: initApp,
  isDataFetched: false,
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
  },
});
const { reducer: appInfoReducer, actions } = appInfoSlice;

export default appInfoReducer;

export const { setAppInfo, setIsDataFetched } = actions;

export const appInfoState = (state: RootState) => state.appInfo;
