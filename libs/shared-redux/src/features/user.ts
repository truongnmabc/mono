import { IUserActions } from "@/models/user/userReactions";
import { IUserInfo, UserInfo } from "@/models/user/userInfo";
import { createSlice } from "@reduxjs/toolkit";
import useActionsThunk from "../repository/user/actions";
import getListActionThunk from "../repository/user/getActions";
import { RootState } from "../store";

export interface IUserReducer {
    userInfo: IUserInfo;
    listActions: IUserActions[];
    shouldOpenLogin: boolean;
}

const init = new UserInfo();

const initState: IUserReducer = {
    userInfo: { ...init },
    listActions: [],
    shouldOpenLogin: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState: { ...initState },
    reducers: {
        logoutHybrid: (state) => {
            state.userInfo = { ...init };
        },

        loginHybrid: (state, action) => {
            state.userInfo = action.payload;
        },
        shouldOpenModalLogin: (state, action) => {
            state.shouldOpenLogin = action.payload;
        },
        shouldIsPro: (state) => {
            const user = state.userInfo;
            state.userInfo = {
                ...user,
                isPro: true,
            };
        },
        setListReactions: (state, action) => {
            state.listActions = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(useActionsThunk.fulfilled, (state, action) => {
            const { questionId, status, partId } = action.payload;

            const existingActionIndex = state.listActions.findIndex(
                (item) => item.questionId === questionId
            );

            if (existingActionIndex !== -1) {
                const existingAction = state.listActions[existingActionIndex];
                state.listActions[existingActionIndex] = {
                    ...existingAction,
                    actions: Array.isArray(status) ? status : [],
                };
            } else {
                state.listActions.push({
                    questionId,
                    actions: Array.isArray(status) ? status : [],
                    userId: parseInt(state.userInfo?.id) || -1,
                    partId,
                });
            }
        });
        builder.addCase(getListActionThunk.fulfilled, (state, action) => {
            const { list } = action.payload;
            state.listActions = list;
        });
    },
});

const { actions, reducer: userReducer } = userSlice;

export const {
    logoutHybrid,
    loginHybrid,
    shouldOpenModalLogin,
    shouldIsPro,
    setListReactions,
} = actions;

export const userState = (state: RootState) => state.userReducer;

export default userReducer;
