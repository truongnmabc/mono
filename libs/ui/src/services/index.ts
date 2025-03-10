import { axiosRequest } from './config/axios';

import {
  getAppReviewApi,
  getSEOAndHeaderContentApi,
  sendEmailApi,
  sendEmailSubscribe,
  verifiedCodeApi,
} from './home';
import { getCountryAPI, getIpFromServer } from './location';
import { checkPaypalStatusAPI, saveToDashboardAPI } from './paypal';
import { reportMistakeApi } from './report';
import { requestGetTitleSeoPage } from './seo';
export {
  axiosRequest,
  checkPaypalStatusAPI,
  getAppReviewApi,
  getCountryAPI,
  getIpFromServer,
  getSEOAndHeaderContentApi,
  reportMistakeApi,
  requestGetTitleSeoPage,
  saveToDashboardAPI,
  sendEmailApi,
  sendEmailSubscribe,
  verifiedCodeApi,
};
