import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { reloadStateThunk } from "../repository/utils/reload";

export type IQueryOpt = {
    subTopicTag?: string;
    partTag?: string;
    type?: string;
};
export interface IStudyReducer {
    selectedTopics: number; // id topic dang chon
    selectedSubTopics: number; // id sub topic dang chon
}
const initStudyReducer: IStudyReducer = {
    selectedTopics: -1,
    selectedSubTopics: -1,
};

export const studySlice = createSlice({
    name: "study",
    initialState: initStudyReducer,
    reducers: {
        selectTopics: (state, action: PayloadAction<number>) => {
            state.selectedTopics = action.payload;
        },
        selectSubTopics: (state, action: PayloadAction<number>) => {
            state.selectedSubTopics = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(reloadStateThunk.fulfilled, (state, action) => {
            state.selectedSubTopics = action.payload.selectedSubTopics;
            state.selectedTopics = action.payload.selectedTopics;
        });
    },
});

const { reducer: studyReducer, actions } = studySlice;

export default studyReducer;

export const { selectTopics, selectSubTopics } = actions;

export const studyState = (state: RootState) => state.studyReducer;
