import { db } from "@/db/db.model";
import { IPaymentInfos } from "@/models/payment/payment";
import { createAsyncThunk } from "@reduxjs/toolkit";

type IPaymentSuccess = {
    data: IPaymentInfos;
};

const paymentSuccessThunk = createAsyncThunk(
    "paymentSuccessThunk",
    async ({ data }: IPaymentSuccess) => {
        await db?.paymentInfos.add(data);
    }
);

export default paymentSuccessThunk;
