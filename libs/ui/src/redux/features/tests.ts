import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type IOpen = {
  openModalSetting: boolean;
  isCurrentTest?: boolean;
  isListEmpty?: boolean;
  testId?: number;
  isEdit?: boolean;
};
export interface ITestReducer {
  openSubmit: boolean;
  shouldOpenSetting: IOpen;
}

const initialState: ITestReducer = {
  openSubmit: false,
  shouldOpenSetting: {
    openModalSetting: false,
    isCurrentTest: false,
    isListEmpty: false,
    testId: -1,
    isEdit: false,
  },
};
const TestSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    shouldOpenSubmitTest: (state, action) => {
      state.openSubmit = action.payload;
    },
    shouldOpenSetting: (state, action: PayloadAction<IOpen>) => {
      state.shouldOpenSetting = {
        ...state.shouldOpenSetting,
        ...action.payload,
      };
    },
  },
});

const { reducer: testReducer, actions } = TestSlice;

export const { shouldOpenSubmitTest, shouldOpenSetting } = actions;

export const testState = (state: RootState) => state.test;

export default testReducer;
