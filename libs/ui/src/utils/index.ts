import { getContactApp } from './contact';
import { decrypt, encrypt } from './crypto';
import { detectAgent } from './device';
import { eventSendGtag, trackingEventGa4 } from './event';
import { convertToJSONObject, parseJSONdata } from './json';
import { calculatorAverageLevel, generateRandomNegativeId } from './math';
import { getAveragePrice, getConfigAppPro, isSubscriptionId } from './paypal';
import { validateEmail, validatePhone } from './validate';

export {
  calculatorAverageLevel,
  convertToJSONObject,
  decrypt,
  detectAgent,
  encrypt,
  eventSendGtag,
  generateRandomNegativeId,
  getAveragePrice,
  getConfigAppPro,
  getContactApp,
  isSubscriptionId,
  parseJSONdata,
  trackingEventGa4,
  validateEmail,
  validatePhone,
};
