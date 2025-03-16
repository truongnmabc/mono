export interface IPaymentInfos {
  id?: string;
  amount: number | string;
  orderId: string; // orderId của gói đang active
  createdDate: number;
  updateDate?: number;
  emailAddress: string;
  userId: string;
  paymentStatus?: number;
  appId: number;
  appShortName?: string;
  payerName?: string;
  payerId?: string;
  status?: string;
  planId?: string;
  planName?: string;
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

export interface IOneWeek {
  planId: string;
  price: number;
}

export interface IPriceConfig extends IOneWeek {
  type: string;
  trialDay: number | null;
  averagePrice: number;
  savePrice: {
    text: string;
    percent: number;
  };
  initPrice: number | null;
}

export interface IResSubcription {
  status: string;
  status_update_time: string;
  id: string;
  plan_id: string;
  start_time: string;
  quantity: string;
  shipping_amount: ShippingAmount;
  subscriber: Subscriber;
  billing_info: BillingInfo;
  create_time: string;
  update_time: string;
  plan_overridden: boolean;
  links: Link[];
  statusCode: number;
}
export interface ShippingAmount {
  currency_code: string;
  value: string;
}
export interface BillingInfo {
  outstanding_balance: OutstandingBalance;
  cycle_executions: CycleExecution[];
  next_billing_time: string;
  failed_payments_count: number;

  last_payment: {
    time: string;
    amount: {
      value: string;
      currency_code: string;
    };
  };
}

export interface OutstandingBalance {
  currency_code: string;
  value: string;
}

export interface CycleExecution {
  tenure_type: string;
  sequence: number;
  cycles_completed: number;
  cycles_remaining: number;
  current_pricing_scheme_version: number;
  total_cycles: number;
}

export interface Subscriber {
  email_address: string;
  payer_id: string;
  name: Name;
  shipping_address: ShippingAddress;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}

export interface Name {
  given_name: string;
  surname: string;
}

export interface ShippingAddress {
  name: Name2;
  address: Address;
}

export interface Name2 {
  full_name: string;
}

export interface Address {
  address_line_1: string;
  address_line_2: string;
  admin_area_2: string;
  postal_code: string;
  country_code: string;
}
