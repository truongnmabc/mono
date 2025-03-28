import { useCallback } from 'react';

import {
  CreateOrderActions,
  FUNDING_SOURCE,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CLIENT_ID, PAYPAL_CURRENCY } from '@ui/constants';
import { IPaymentInfos } from '@ui/models/payment';
import { selectAppInfo } from '@ui/redux/features/appInfo.reselect';
import { selectUserInfo } from '@ui/redux/features/user.reselect';
import paymentSuccessThunk from '@ui/redux/repository/payment/paymentSuccess';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import { useSetIsProServer } from '@ui/services/actions';
import {
  saveToDashboardAPI,
  updateUserInfoDashboard,
  uploadPaymentInfoAPI,
} from '@ui/services/payment';
import './PayPalButtonView.scss';

export type CreateOrderData = {
  paymentSource: FUNDING_SOURCE;
};

type IRes = {
  status: number;
};
const initialOptions = {
  clientId: PAYPAL_CLIENT_ID,
  currency: PAYPAL_CURRENCY,
  intent: 'capture',
};
const PayPalBtn = ({
  paymentSuccess,
  price,
}: {
  paymentSuccess: () => void;
  price: number;
}) => {
  const appInfo = useAppSelector(selectAppInfo);
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  const onSavePayment = useCallback(
    async (payment: IPaymentInfos) => {
      try {
        const obj = { ...payment };
        const promises = [
          uploadPaymentInfoAPI(obj),
          updateUserInfoDashboard({
            email: userInfo?.email,
            appShortName: appInfo.appShortName,
            appId: appInfo.appId + '',
            isBuy: true,
          }),
          saveToDashboardAPI({
            app: appInfo.appShortName,
            price: price,
            email: userInfo.email,
          }),
        ];

        const responses = (await Promise.all(promises)) as unknown as IRes[];

        const allSuccess = responses.every(
          (response: { status: number }) => response && response.status === 200
        );
        if (allSuccess) {
          dispatch(
            paymentSuccessThunk({
              data: payment,
            })
          );
          paymentSuccess();
          useSetIsProServer();
        }
      } catch (error) {
        console.log('🚀 ~ error:', error);
      }
    },
    [userInfo, appInfo, price, dispatch, paymentSuccess]
  );

  const handleCreateOrder = useCallback(
    (data: CreateOrderData, actions: CreateOrderActions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: PAYPAL_CURRENCY,
              value: price.toString(),
            },
          },
        ],
        intent: 'CAPTURE',
      });
    },
    [price]
  );

  const onApproveOrder = useCallback(
    async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
      if (actions.order) {
        await actions.order.capture().then((res) => {
          if (res.status !== 'COMPLETED') {
            const payment: IPaymentInfos = {
              appId: appInfo.appId,
              userId: userInfo?.id,
              createdDate: new Date(res.create_time || '').getTime(),
              updateDate: new Date(res.update_time || '').getTime(),
              emailAddress: userInfo.email,
              amount: price,
              orderId: res.id || '',
              paymentStatus: 1,
              appShortName: appInfo.appShortName,
              payerName: res.payer?.name?.given_name || '',
              payerId: res.payer?.payer_id || '',
              planId: '',
              planName: '',
              status: '',
            };

            onSavePayment(payment);
          }
        });
      } else {
        return Promise.resolve();
      }
    },
    [
      onSavePayment,
      appInfo.appId,
      appInfo.appShortName,
      price,
      userInfo.email,
      userInfo.id,
    ]
  );

  return (
    <div className="main-paypal-button">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: 'pill',
            tagline: false,
            height: 50,
            color: 'white',
            layout: 'vertical',
          }}
          createOrder={handleCreateOrder}
          onApprove={onApproveOrder}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalBtn;
