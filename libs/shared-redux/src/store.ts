import { configureStore } from "@reduxjs/toolkit";
import { appInfoReducer } from "./features/appInfo";
import appConfigReducer from "./features/appConfig";
import studyReducer from "./features/study";
import gameReducer from "./features/game";
import userReducer from "./features/user";
import testReducer from "./features/tests";
import paymentReducer from "./features/payment";

export const makeStore = () => {
    return configureStore({
        reducer: {
            appInfoReducer,
            appConfigReducer,
            studyReducer,
            gameReducer,
            testReducer,
            userReducer,
            paymentReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
