import { createSlice } from '@reduxjs/toolkit';
import { IUserActions, IUserInfo, UserInfo } from '@ui/models/user';
import useActionsThunk from '../repository/user/actions';
import getListActionThunk from '../repository/user/getActions';
import { RootState } from '../store';

export interface IUserReducer {
  userInfo: IUserInfo;
  listActions: IUserActions[];
  shouldOpenLogin: boolean;
  isTester: boolean;
}

const init = new UserInfo();

const initState: IUserReducer = {
  userInfo: { ...init },
  listActions: [],
  shouldOpenLogin: false,
  isTester: false,
};

const userSlice = createSlice({
  name: 'user',
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
    clearIsPro: (state) => {
      const user = state.userInfo;
      state.userInfo = {
        ...user,
        isPro: false,
      };
    },
    setListReactions: (state, action) => {
      state.listActions = action.payload;
    },
    setIsTester: (state, action) => {
      state.isTester = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(useActionsThunk.fulfilled, (state, action) => {
      const { questionId, status } = action.payload;

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
  setIsTester,
  clearIsPro,
} = actions;

export const userState = (state: RootState) => state.user;

export default userReducer;
