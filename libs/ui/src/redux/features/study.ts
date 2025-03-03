import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import selectSubTopicThunk from '../repository/study/select';
import { reloadStateThunk } from '../repository/utils/reload';
import { RootState } from '../store';

export type IStatusTopic = 'completed' | 'unlocked' | 'locked';
type IStatus = {
  id: number;
  status: IStatusTopic;
};

export interface IStudyReducer {
  selectedTopics: number; // id topic dang chon
  selectedSubTopics: number; // id sub topic dang chon
  listStatus: IStatus[]; // status của từng topic
}
const initStudyReducer: IStudyReducer = {
  selectedTopics: -1,
  selectedSubTopics: -1,
  listStatus: [],
};

const studySlice = createSlice({
  name: 'study',
  initialState: initStudyReducer,
  reducers: {
    selectTopics: (state, action: PayloadAction<number>) => {
      state.selectedTopics = action.payload;
    },
    selectSubTopics: (state, action: PayloadAction<number>) => {
      state.selectedSubTopics = action.payload;
    },
    resetStateStudy: (state) => {
      state.selectedSubTopics = -1;
      state.selectedTopics = -1;
      state.listStatus = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(reloadStateThunk.fulfilled, (state, action) => {
      state.selectedSubTopics = action.payload.selectedSubTopics;
      state.selectedTopics = action.payload.selectedTopics;
    });
    builder.addCase(selectSubTopicThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.listStatus = action.payload.list;
        state.selectedSubTopics = action.payload.subTopicId;
      }
    });
  },
});

const { reducer: studyReducer, actions } = studySlice;

export default studyReducer;

export const { selectTopics, selectSubTopics, resetStateStudy } = actions;

export const studyState = (state: RootState) => state.study;
