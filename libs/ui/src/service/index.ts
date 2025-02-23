import { axiosRequest } from './config/axios';

import {
  getAppReviewApi,
  getSEOAndHeaderContentApi,
  sendEmailApi,
  sendEmailSubscribe,
  verifiedCodeApi,
} from './home';
import { saveToDashboardAPI, checkPaypalStatusAPI } from './paypal';
import { getCountryAPI, getIpFromServer } from './location';
import { reportMistakeApi } from './report';
import { requestGetTitleSeoPage } from './seo';
import { requestUpdateUserDataToServer } from './sync';
export {
  getAppReviewApi,
  getSEOAndHeaderContentApi,
  sendEmailApi,
  sendEmailSubscribe,
  verifiedCodeApi,
  axiosRequest,
  saveToDashboardAPI,
  checkPaypalStatusAPI,
  getCountryAPI,
  getIpFromServer,
  reportMistakeApi,
  requestGetTitleSeoPage,
  requestUpdateUserDataToServer,
};
