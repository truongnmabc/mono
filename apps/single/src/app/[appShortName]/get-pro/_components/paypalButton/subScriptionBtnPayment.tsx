import { PAYPAL_SUBSCRIPTION_CLIENT_ID } from "@/constants";
import { IAppInfo } from "@/models/app/appInfo";
import { IPaymentInfos } from "@/models/payment/payment";
import { selectPaymentInfo } from "@/redux/features/payment.reselect";
import { shouldIsPro } from "@/redux/features/user";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import paymentSuccessThunk from "@/redux/repository/payment/paymentSuccess";
import {
    cancelSubscriptionAPI,
    checkPaypalStatusAPI,
    IResSubcription,
} from "@/services/paypal.service";
import { IPriceConfig } from "@/utils/paypal";
import {
    CreateSubscriptionActions,
    OnApproveActions,
    OnApproveData,
} from "@paypal/paypal-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useCallback } from "react";

// const listEventName = [
//     "basic_upgrade_success",
//     "popular_upgrade_success",
//     "economical_upgrade_success",
// ];

const initialOptions = {
    clientId: PAYPAL_SUBSCRIPTION_CLIENT_ID,
    intent: "subscription",
    vault: true,
};

const SubScriptionButton = ({
    paymentSuccess,
    valueButton,
    appInfo,
}: {
    paymentSuccess: () => void;
    valueButton: IPriceConfig;
    appInfo: IAppInfo;
}) => {
    const dispatch = useAppDispatch();
    const paymentInfo = useAppSelector(selectPaymentInfo);
    const userInfo = useAppSelector(selectUserInfo);

    const onSavePayment = useCallback(
        async (details: IResSubcription) => {
            try {
                console.log("🚀 ~ details:", details);
                // const payerName = details.subscriber?.name?.given_name ?? "";
                const expiryDate = details.billing_info?.next_billing_time;
                // const emailSubScription = details.subscriber?.email_address ?? "";
                // const { email: emailSupport } = getContactApp(appInfo.appShortName);

                let price = "";
                // cancel subscription trước đó (trường hợp upgrade lên gói mới) (cancel trên paypal)
                if (details?.billing_info?.last_payment) {
                    price = details?.billing_info?.last_payment?.amount?.value;
                } else {
                    // *NOTE: cho check lai
                    // let item = details.billing_info.cycle_executions?.find(
                    //     (e) => e.tenure_type == "REGULAR"
                    // );
                    // if (item) {
                    //     price =
                    //         item?.total_price_per_cycle?.total_item_amount?.value;
                    // }
                }
                if (paymentInfo?.orderId) {
                    cancelSubscriptionAPI(paymentInfo?.orderId);
                }

                const payment: IPaymentInfos = {
                    appId: appInfo.appId,
                    userId: userInfo?.id,
                    createdDate: new Date(details.create_time || "").getTime(),
                    updateDate: new Date(
                        details.status_update_time || ""
                    ).getTime(),
                    emailAddress: userInfo.email,
                    amount: price,
                    orderId: details.id || "",
                    paymentStatus: details.statusCode,
                    appShortName: appInfo.appShortName,
                    payerName: details.subscriber?.name?.given_name || "",
                    payerId: details.subscriber?.payer_id || "",
                    planId: details.plan_id,
                    planName: valueButton.type,
                    status: details.status,
                    expiredDate: new Date(expiryDate).getTime(),
                };
                dispatch(shouldIsPro());
                dispatch(
                    paymentSuccessThunk({
                        data: payment,
                    })
                );
                paymentSuccess();

                // await uploadPaymentInfoAPI(payment);
                // await updateUserInfoDashboard({
                //     email: userInfo?.email,
                //     appShortName: appInfo.appShortName,
                //     appId: appInfo.appId + "",
                //     isBuy: true,
                // });
                // await saveToDashboardAPI({
                //     app: appInfo.appShortName,
                //     price: Number(price),
                //     email: userInfo.email,
                // });
                // await sendEmailSubscribeSuccessAPI({
                //     appName: appInfo.appShortName,
                //     price: "$" + price.toString(),
                //     email: emailSubScription,
                //     emailSupport: emailSupport || "",
                //     learnPageSlug: "",
                //     name: payerName,
                //     timeExpiration: new Date(expiryDate),
                //     totalQuestion: appConfig.questionNumber,
                // });
            } catch (err) {
                console.log("🚀 ~ err:", err);
            }
        },
        [
            dispatch,
            paymentSuccess,
            appInfo.appId,
            appInfo.appShortName,
            paymentInfo?.orderId,
            userInfo.email,
            userInfo.id,
            valueButton.type,
        ]
    );

    const handleCreateSubscription = useCallback(

        
        (data: Record<string, unknown>, actions: CreateSubscriptionActions) => {

            return actions.subscription.create({
                plan_id: valueButton.planId,
            });
        },
        [valueButton.planId]
    );
        console.log("🚀 ~ valueButton:", valueButton)

    const onApproveOrder = useCallback(
        async (
            data: OnApproveData,
            actions: OnApproveActions
        ): Promise<void> => {
            if (actions.subscription) {
                try {
                    if (data.subscriptionID) {
                        const details = await checkPaypalStatusAPI(
                            data.subscriptionID
                        );
                        if (details) {
                            return onSavePayment(details);
                        }
                    }
                } catch (error) {
                    console.log("🚀 ~ error:", error);
                }
            } else {
                return Promise.resolve();
            }
        },
        [onSavePayment]
    );

    return (
        <div className="main-paypal-button">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{
                        shape: "pill",
                        tagline: false,
                        height: 50,
                        color: "white",
                        layout: "vertical",
                    }}
                    createSubscription={handleCreateSubscription}
                    onApprove={onApproveOrder}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default SubScriptionButton;
