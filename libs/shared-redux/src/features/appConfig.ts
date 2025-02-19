import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IAppConfigData } from '@shared-models/app';
import { RootState } from '../store';
interface IAppConfigReducer {
  appConfig: IAppConfigData;
}
const initialState: IAppConfigReducer = {
  appConfig: {
    gaId: 'UA-167769768-1',
    tagManagerId: 'GTM-NFL5XHT',
    appId: -1,
    googleVerifyId: 'J65PLlMKrhHcS6Ql3keUP-l6_tzEDu_5RgZxybRrhDE',
    mainColor: '#329678',
    mainColorBold: '#39B08C',
    mainBackgroundColor: '#f8fdff',
    mainBackgroundColorContact: '#f8fdff',
    linearGradientBanner: 'linear-gradient(90deg, #FFEED5 0%, #FFFCD9 100%)',
    GA4ID: 'G-9WFY79Y40M',
    pageId: '110654290809849',
    wpDomain: 'https://passemall.com',
    cookie: '#278F61',
    bgColorStartTest: '#e2a650',
    bgColorCloseCookie: '#3E6798',
    mainColorUpgradePro: '#329678',
    appleClientId: '',
  },
};
const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setAppConfig: (state, action: PayloadAction<IAppConfigData>) => {
      state.appConfig = { ...action.payload };
    },
  },
});

const { reducer: appConfigReducer, actions } = appConfigSlice;

export const { setAppConfig } = actions;
export default appConfigReducer;

export const appConfigState = (state: RootState) => state.appConfig;
