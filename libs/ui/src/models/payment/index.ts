export interface IPaymentInfos {
    id?: string;
    amount: number | string;
    orderId: string; // orderId của gói đang active
    createdDate: number;
    updateDate: number;
    emailAddress: string;
    userId: string;
    paymentStatus: number;
    appId: number;
    appShortName: string;
    payerName: string;
    payerId: string;
    status: string;
    planId: string;
    planName: string;
    expiredDate?: number | string; // trường này được lấy theo next_billing_time của paypal nhé (nếu cancel thì sẽ k có trường đó thì cần check)

    // *NOTE: chua ro can nhung truong gi

    PURCHASED?: number;
    paymentSource?: string;
    buyPro?: number; // trường này cần được gọi api để check và update vào đây
    timeLeftDiscount?: number;
    type?: number;
}

export interface InAppSubscription {
    id: number;
    appId: number;
    userId: string; // email đăng nhập
    os: string;
    createDate: number;
    purchaseDate: number;
    expriredDate: number; // thời hạn của lần ra hạn hiện tại
    purchased: boolean; // đã thanh toán hay chưa
    trialPeriod: boolean; // trong trial hay không
    in_app: {
        purchase_date: number; //thời gian thanh toán
        expires_date: number; // thời gian hết hạn
        in_app_ownership_type: string; // trạng thái PURCHASED | FAMILY_SHARE...
        is_trial_period: boolean; // đang trial
    }[]; //ds các lần thanh toán của gói này (ở đây không lưu transactionId vì không cần dùng đến)
}
