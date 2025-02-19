import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ITestReducer {
  openSubmit: boolean;
}

const initialState: ITestReducer = {
  openSubmit: false,
};
const TestSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    shouldOpenSubmitTest: (state, action) => {
      state.openSubmit = action.payload;
    },
  },
});

const { reducer: testReducer, actions } = TestSlice;

export const { shouldOpenSubmitTest } = actions;

export const testState = (state: RootState) => state.test;

export default testReducer;
