import { validateEmail, validatePhone } from './validate';
import { getContactApp } from './contact';
import { convertToJSONObject, parseJSONdata } from './json';
import { calculatorAverageLevel, generateRandomNegativeId } from './math';
import { detectAgent } from './device';
import { encrypt, decrypt } from './crypto';
import { getConfigAppPro } from './paypal';
import { eventSendGtag, trackingEventGa4 } from './event';

export {
  validateEmail,
  validatePhone,
  getContactApp,
  convertToJSONObject,
  parseJSONdata,
  calculatorAverageLevel,
  generateRandomNegativeId,
  detectAgent,
  encrypt,
  decrypt,
  getConfigAppPro,
  eventSendGtag,
  trackingEventGa4,
};
