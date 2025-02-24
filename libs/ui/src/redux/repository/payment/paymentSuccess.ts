import { db } from '@ui/db';
import { IPaymentInfos } from '@ui/models/payment';
import { createAsyncThunk } from '@reduxjs/toolkit';

type IPaymentSuccess = {
  data: IPaymentInfos;
};

const paymentSuccessThunk = createAsyncThunk(
  'paymentSuccessThunk',
  async ({ data }: IPaymentSuccess) => {
    await db?.paymentInfos.add(data);
  }
);

export default paymentSuccessThunk;
