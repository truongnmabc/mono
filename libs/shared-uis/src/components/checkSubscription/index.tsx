"use client";
import { selectPaymentInfo } from "@/redux/features/payment.reselect";
import { useAppSelector } from "@/redux/hooks";
// import { checkPaypalStatusAPI } from "@/services/paypal.service";
// import { isSubscriptionId } from "@/utils/paypal";
import Dialog from "@mui/material/Dialog";
import React, { useEffect, useState } from "react";

const PopupSubscription = () => {
    const [option] = useState({
        showPopup: false,
        message: "",
        cancelled: false,
    });
    // const dispatch = useAppDispatch();
    const paymentInfo = useAppSelector(selectPaymentInfo);
    const cancelledSubscription = async () => {
        // let object = { ...paymentInfo, forceUpdate: true, type: 0, buyPro: 0, purchared: 0 };
        // // chỉ cancel theo cách là update lại datastore thôi
        // await uploadPaymentInfoAPI(object);
        // dispatch(paymentSuccessAction(paymentInfo));
        // ga.event({ action: "cancel_subscription", params: {} });
        // setTimeout(() => {
        //     window.location.reload();
        // }, 500);
    };

    // const handleSetCookieToken = async (next_billing_time: string) => {
    //     let token = await jwt.sign(
    //         {
    //             timeExpired: next_billing_time,
    //             appId: appInfo.appId,
    //         },
    //         process.env.NEXT_PUBLIC_SECRET_KEY
    //     );
    //     setCookieDate(PAYPAL_SUBSCRIPTION_KEY, token, new Date(next_billing_time));
    //     if (new Date(next_billing_time).getTime() !== paymentInfo.expiredDate) {
    //         // chỗ này chỉ update lại expiredDate nên nếu khác nhau thì mới làm
    //         let object = {
    //             ...paymentInfo,
    //             forceUpdate: true,
    //             expiredDate: new Date(next_billing_time).getTime(),
    //         };
    //         await uploadPaymentInfoAPI(object);
    //         dispatch(paymentSuccessAction(object));
    //     }
    // };

    // async function checkPaymentInfoFC() {
    //     let cookieValue = getCookie(PAYPAL_SUBSCRIPTION_KEY);
    //     let decodedToken = null;
    //     if (cookieValue) {
    //         try {
    //             decodedToken = jwt.verify(
    //                 cookieValue,
    //                 process.env.NEXT_PUBLIC_SECRET_KEY
    //             );
    //         } catch (error) {
    //             console.log("error", error);
    //         }
    //     }

    //     // ** đoạn này sẽ ghi đè paymentInfo trên datastore (chú ý có thể có vđề về logic)
    //     if (
    //         paymentInfo &&
    //         isSubscriptionId(paymentInfo.orderId) &&
    //         paymentInfo.orderId?.length &&
    //         (!decodedToken || // chú ý đoạn này timeExpired được set khi mua hàng thành công (lấy trường next_billing_time của paypal trả về)
    //             // mà khoảng cách thời gian của trường đó với thời gian bắt đầu có hiệu lực không phải là 3 ngày (theo free Trial), nên chỗ này cần chú ý
    //             new Date(decodedToken?.timeExpired).getTime() < Date.now() ||
    //             appInfo.appId != decodedToken.appId)
    //     ) {
    //         // nếu hết hạn hoặc chưa có trong cookie thì mới đi vào đây
    //         let data: any = await checkPaypalStatusAPI(paymentInfo.orderId);
    //         if (data?.status) {
    //             // APPROVAL_PENDING. The subscription is created but not yet approved by the buyer.
    //             // APPROVED. The buyer has approved the subscription.
    //             // ACTIVE. The subscription is active.
    //             // SUSPENDED. The subscription is suspended.
    //             // CANCELLED. The subscription is cancelled.
    //             // EXPIRED. The subscription is expired.
    //             let messagStr = "";

    //             switch (data.status) {
    //                 case "APPROVAL_PENDING":
    //                     // user need approved
    //                     messagStr =
    //                         "Please approve your subscription on Paypal to start using our Pro version";
    //                     break;
    //                 case "APPROVED":
    //                     // waiting admin approved
    //                     messagStr = "Admin approved";
    //                     break;
    //                 case "CANCELLED":
    //                 case "SUSPENDED":
    //                     if (handleCheckTimeExpired(paymentInfo) == true) {
    //                         messagStr =
    //                             "Your subscription is cancelled. Please re-activate it to use our Pro version";
    //                     } else {
    //                         handleSetCookieToken(
    //                             convertMillisecondsToDateZTime(
    //                                 paymentInfo.expiredDate
    //                             )
    //                         );
    //                     }
    //                     //cancelled subscription
    //                     //cho ve ban thuong
    //                     break;
    //                 case "EXPIRED":
    //                     //user need renew
    //                     if (handleCheckTimeExpired(paymentInfo) == true) {
    //                         messagStr =
    //                             "Your subscription is expired. Please re-activate it to use our Pro version";
    //                     } else {
    //                         handleSetCookieToken(
    //                             convertMillisecondsToDateZTime(
    //                                 paymentInfo.expiredDate
    //                             )
    //                         );
    //                     }
    //                     break;
    //                 case "ACTIVE":
    //                     let next_billing_time: string =
    //                         data.billing_info?.next_billing_time;
    //                     if (next_billing_time) {
    //                         handleSetCookieToken(next_billing_time);
    //                     }
    //             }
    //             if (messagStr?.length) {
    //                 setOption({
    //                     ...option,
    //                     showPopup: true,
    //                     message: messagStr,
    //                 });
    //             }
    //         }
    //     }
    // }
    useEffect(() => {
        // if (!!paymentInfo) checkPaymentInfoFC();
    }, [paymentInfo]);

    return (
        <Dialog
            open={option.showPopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className="main-popup-subscription">
                <p className="title">{option.message}</p>
                <div className="btn">
                    <button
                        className="pay_late"
                        onClick={cancelledSubscription}
                    >
                        Back to Free Version
                    </button>
                    <button
                        className="btn_paypal"
                        onClick={() => {
                            window.open("https://paypal.com/", "_blank");
                        }}
                    >
                        Go to Paypal
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default PopupSubscription;
