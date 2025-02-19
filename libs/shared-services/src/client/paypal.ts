import { isProduction } from 'libs/constants';
import { requestGetData, requestPostData } from './request';

// *NOTE: can check lai
/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_get
 * lấy thông tin của đơn hàng hiện tại
 */

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

export interface Subscriber {
  email_address: string;
  payer_id: string;
  name: Name;
  shipping_address: ShippingAddress;
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

export interface Link {
  href: string;
  rel: string;
  method: string;
}

export const checkPaypalStatusAPI = async (orderId: string) => {
  const data = await requestGetData({
    url:
      'api/auth?type=check-status-subcription&orderId=' +
      orderId +
      (!isProduction ? '&dev=true' : ''),
    config: {
      baseURL: 'https://test-dot-micro-enigma-235001.appspot.com',
    },
  });

  return data as IResSubcription;
};

/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#plans_get
 * lấy thông tin của gói (quan tâm đến thời gian hiệu lực của nó)
 */
export const getPlanInfoApi = async (planId: string) => {
  const data = await requestGetData({
    url: 'api/auth',
    params: {
      type: 'get-plan-info',
      planId: planId,
      dev: isProduction ? undefined : 'true',
    },
    config: {
      baseURL: 'https://dev-dot-micro-enigma-235001.appspot.com',
    },
  });
  return data;
};
/**
 * https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_transactions
 * thông tin các lần thanh toán gia hạn ???
 */
export const getTransactionsSubscriptionApi = async (orderId: string) => {
  const data = await requestGetData({
    url: 'api/auth',
    params: {
      type: 'get-transactions-subscription',
      orderId: orderId,
      dev: isProduction ? undefined : 'true',
    },
    config: {
      baseURL: 'https://dev-dot-micro-enigma-235001.appspot.com',
    },
  });
  return data;
};

export const cancelSubscriptionAPI = async (orderId: string) => {
  try {
    const data = await requestGetData({
      url: 'api/auth',
      params: {
        type: 'cancel-subscription',
        orderId: orderId,
        dev: isProduction ? undefined : 'true',
      },
      config: {
        baseURL: 'https://dev-dot-micro-enigma-235001.appspot.com',
      },
    });
    return data;
  } catch (error) {
    console.log('error', error);
    return undefined;
  }
};

export const sendEmailSubscribeSuccessAPI = async ({
  price,
  appName,
  email,
  name,
  timeExpiration,
  totalQuestion,
  emailSupport,
  learnPageSlug,
}: {
  appName: string;
  price: string;
  email: string;
  timeExpiration: Date;
  totalQuestion: string;
  name: string;
  emailSupport: string;
  learnPageSlug: string;
}) => {
  try {
    const website = window.location.origin;
    const learnPage = website + learnPageSlug;
    const billingPage = website + '/billing';
    const params = {
      learnPage,
      billingPage,
      emailSupport,
      website,
      price,
      email,
      totalQuestion,
      timeExpiration,
      name,
      appName: appName,
    };
    const data = await requestPostData({
      url: 'api/auth?type=send-email-success-subscription',
      data: params,
      config: {
        baseURL: 'https://dev-dot-micro-enigma-235001.appspot.com/',
      },
    });
    return data;
  } catch (error) {
    console.log('error', error);
    return undefined;
  }
};
