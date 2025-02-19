import { configureStore } from '@reduxjs/toolkit';
import { baseReducers } from '@shared-redux/store';

export const makeStore = () => {
  return configureStore({
    reducer: {
      ...baseReducers, // Kế thừa toàn bộ reducers từ baseStore
    },
  });
};
export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];
