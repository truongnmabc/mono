import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { InAppSubscription, IPaymentInfos } from '@ui/models/payment';
import { IUserActions } from '@ui/redux/repository/user/getActions';
import { RootState } from '../store';

export interface IUserReducer {
  paymentInfo: IPaymentInfos | null; // thông tin mua hàng của app đang được xét, được tải về khi vào trang
  inAppPurchasedInfo: InAppSubscription[]; // 1 app có thể mua nhiều gói (giống với nhiều orderId trên web)
  listActions: IUserActions[];
}

const initState: IUserReducer = {
  paymentInfo: null,
  inAppPurchasedInfo: [],
  listActions: [],
};

const paymentSlice = createSlice({
  name: 'user',
  initialState: { ...initState },
  reducers: {
    paymentSuccessAction: (state, action: PayloadAction<IPaymentInfos>) => {
      state.paymentInfo = action.payload ?? null;
      if (action.payload) {
      }
    },
  },
  extraReducers: (builder) => {},
});

const { actions, reducer: paymentReducer } = paymentSlice;

export const { paymentSuccessAction } = actions;
export const paymentState = (state: RootState) => state.payment;
export default paymentReducer;
