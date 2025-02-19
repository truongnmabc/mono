import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ITestReducer {
    openSubmit: boolean;
}

const initialState: ITestReducer = {
    openSubmit: false,
};
export const TestSlice = createSlice({
    name: "tests",
    initialState,
    reducers: {
        shouldOpenSubmitTest: (state, action) => {
            state.openSubmit = action.payload;
        },
    },
});

const { reducer: testReducer, actions } = TestSlice;

export const { shouldOpenSubmitTest } = actions;

export const testState = (state: RootState) => state.testReducer;

export default testReducer;
