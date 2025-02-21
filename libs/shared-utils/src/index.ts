// import { validateEmail, validatePhone } from './validate';
import { getContactApp } from './contact';
import { decrypt, encrypt } from './crypto';
import { detectAgent } from './device';
import { eventSendGtag, trackingEventGa4 } from './event';
import { convertToJSONObject, parseJSONdata } from './json';
import { calculatorAverageLevel, generateRandomNegativeId } from './math';
import { getConfigAppPro } from './paypal';

export {
  calculatorAverageLevel,
  convertToJSONObject,
  decrypt,
  detectAgent,
  encrypt,
  eventSendGtag,
  generateRandomNegativeId,
  getConfigAppPro,
  // validateEmail,
  // validatePhone,
  getContactApp,
  parseJSONdata,
  trackingEventGa4,
};
