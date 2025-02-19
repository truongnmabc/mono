import { createSelector } from "reselect";
import { appInfoState } from "./appInfo";

export const selectAppInfo = createSelector(
    [appInfoState],
    (appInfoReducer) => appInfoReducer.appInfo
);

export const selectIsDataFetched = createSelector(
    [appInfoState],
    (appInfoReducer) => appInfoReducer.isDataFetched
);
