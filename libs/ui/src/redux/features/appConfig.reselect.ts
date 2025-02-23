import { createSelector } from "reselect";
import { appConfigState } from "./appConfig";

export const selectAppConfig = createSelector(
    [appConfigState],
    (reducer) => reducer.appConfig
);
