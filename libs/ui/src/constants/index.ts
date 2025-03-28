import { IGameMode } from '@ui/models/tests/tests';

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const RANDOM_COLORS = [
  '#30749F',
  '#E68A4F',
  '#309F98',
  '#8CCAC7',
  '#DAB542',
  '#656C86',
  '#789A6B',
  '#859051',
  '#CCA68B',
  '#4fdbb7',
  '#962434',
  '#729e1d',
  '#eaae2a',
  '#86b5fe',
  '#c7be6d',
  '#e46873',
  '#a5b34f',
  '#43c59e',
  '#984fe6',
  '#4a2267',
  '#11c8c4',
  '#579362',
  '#b95226',
  '#8f6232',
  '#5d9133',
  '#97af7a',
  '#7b9bd1',
  '#c9c695',
];

export const timeCaching = 1 * 1000 * 60 * 60;

export const isProduction = process.env['NODE_ENV'] === 'production';

export const listAppState = ['cdl'];

export const baseImageUrl =
  'https://storage.googleapis.com/micro-enigma-235001.appspot.com/';

// Constants

export const PAYPAL_SUBSCRIPTION_CLIENT_ID = isProduction
  ? 'AdB2eO_M5-okrwgabqjSMgbxuJGSXuw7tOTXNIPonty8TiHtCTZGjIErVHaBRYhsGQWNYZQjQlq4tJat'
  : 'AVyimUfmrrnWOGW7GFSXlYm77H4O-JvvRBSBMqBDNj1_ATxF-hRsccOmXxx8lenoD1SND5UjC-MlY9Jm';

export const PAYPAL_SUBSCRIPTION_KEY = 'subcription_key';

export const PAYPAL_CLIENT_ID = isProduction
  ? 'AdB2eO_M5-okrwgabqjSMgbxuJGSXuw7tOTXNIPonty8TiHtCTZGjIErVHaBRYhsGQWNYZQjQlq4tJat'
  : 'ASZuK4V1rzGFj333OzSTQM_TeNeD7VWkhTCUjoy2y6p7dgbIAoSYTSGaKwMGiGVoaHMxC-Mdb8D3wa3E';

export const PAYPAL_CURRENCY = 'USD';

export const HTTP_REQUEST_SUCCESS = 200;

export const HTTP_REQUEST_TIMEOUT = 30000;

export const BASE_WP = 'https://api.cdl-prep.com';

export const PURCHASED = 1;

export const BASE_URL = 'https://test-dot-micro-enigma-235001.appspot.com';

export const BASE_URL_PROP =
  'https://api-cms-v2-dot-micro-enigma-235001.appspot.com';

export const BASE_URL_DEV = 'https://dev-dot-micro-enigma-235001.appspot.com';

export const DASHBOARD_API = `https://dashboard-api2.abc-elearning.org/`;

export const KEY_CLICK_ADS = 'sdakcilc';

export const MAX_CLICK_ADS_PER_USER = 3;

export const BASE_STORE_URL =
  'https://storage.googleapis.com/micro-enigma-235001.appspot.com';

export const BASE_IMAGE_URL =
  'https://storage.googleapis.com/micro-enigma-235001.appspot.com';

export const PATH_IMAGE = 'web/images';

export const GameTypeStatus: Record<IGameMode, number> = {
  learn: 0,
  practiceTests: 1,
  finalTests: 9,
  diagnosticTest: 10,
  customTests: 3,
  // Không dùng trên app
  branchTest: 12,
  review: 13,
} as const;

export const TypeParam: Record<IGameMode, IGameMode> = {
  diagnosticTest: 'diagnosticTest',
  finalTests: 'finalTests',
  customTests: 'customTests',
  practiceTests: 'practiceTests',
  review: 'review',
  branchTest: 'branchTest',
  learn: 'learn',
};

export const TypeConstTest: Record<number, IGameMode> = {
  1: TypeParam.practiceTests,
  3: TypeParam.finalTests,
  4: TypeParam.branchTest,
  5: TypeParam.customTests,
  6: TypeParam.diagnosticTest,
};

export const TestConstType: Record<IGameMode, number> = {
  practiceTests: 1,
  finalTests: 2,
  branchTest: 4,
  customTests: 5,
  diagnosticTest: 6,
  review: 7,
  learn: 8,
};

export const MockPlantId: Record<string, string> = {
  '1 week': 'P-5GE18939GM962423UMQVLK5Y',
  '1 month': 'P-2SH95524CM0826016MQVLLUI',
  '1 year': 'P-1VY99078S4786524AMQVLL4A',
};
