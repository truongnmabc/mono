import { validateEmail, validatePhone } from './validate';
import { getContactApp } from './contact';
import { decrypt, encrypt } from './crypto';
import { detectAgent } from './device';
import { eventSendGtag, trackingEventGa4 } from './event';
import { convertToJSONObject, parseJSONdata } from './json';
import { calculatorAverageLevel, generateRandomNegativeId } from './math';
import {
  getConfigAppPro,
  getAveragePrice,
  getConfigProV2,
  isSubscriptionId,
} from './paypal';

export {
  calculatorAverageLevel,
  convertToJSONObject,
  decrypt,
  detectAgent,
  encrypt,
  eventSendGtag,
  generateRandomNegativeId,
  getConfigAppPro,
  getAveragePrice,
  getConfigProV2,
  isSubscriptionId,
  validateEmail,
  validatePhone,
  getContactApp,
  parseJSONdata,
  trackingEventGa4,
};
