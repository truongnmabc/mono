import { createSelector } from "reselect";
import { studyState } from "./study";

export const selectSubTopicsId = createSelector(
    [studyState],
    (reducer) => reducer.selectedSubTopics
);

export const selectTopicsId = createSelector(
    [studyState],
    (reducer) => reducer.selectedTopics
);
