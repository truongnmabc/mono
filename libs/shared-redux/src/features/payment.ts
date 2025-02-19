import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getUserDeviceLogin } from "../repository/sync/syncData";

import { RootState } from "../store";
import { InAppSubscription, IPaymentInfos } from "@/models/payment/payment";
import { IUserActions } from "../repository/user/actions";

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
    name: "user",
    initialState: { ...initState },
    reducers: {
        paymentSuccessAction: (state, action: PayloadAction<IPaymentInfos>) => {
            state.paymentInfo = action.payload ?? null;
            if (action.payload) {
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUserDeviceLogin.fulfilled, (state, action) => {
            if (action.payload) {
                const { paymentInfo, inAppSubs } = action.payload;
                if (action.payload) {
                    state.paymentInfo = paymentInfo;
                    state.inAppPurchasedInfo = inAppSubs;
                }
            }
        });
    },
});

const { actions, reducer: paymentReducer } = paymentSlice;

export const { paymentSuccessAction } = actions;

export const paymentState = (state: RootState) => state.paymentReducer;

export default paymentReducer;
