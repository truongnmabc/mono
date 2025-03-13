export const BASE_URL = 'https://test-dot-micro-enigma-235001.appspot.com';
export const BASE_URL_PROP =
  'https://api-cms-v2-dot-micro-enigma-235001.appspot.com';
export const BASE_URL_DEV = 'https://dev-dot-micro-enigma-235001.appspot.com';
export const DASHBOARD_API = 'https://dashboard-api2.abc-elearning.org/';
export const TRACKING_API = 'https://app-tracking.abc-elearning.org/';

export const API_PATH = {
  APP_INFO: '/api/appInfos',
  APP_CONFIG: '/api/appConfig',
  GET_SEO: '/api/getSeo',
  GET_DATA_STUDY: '/api/study',
  GET_DATA_STATE: '/api/state',
  GET_DATA_TOPICS: '/api/topics',
  GET_QUESTION_BY_ID: '/api/getQuestion',
  GET_APP_REVIEW: '/api/getAppReview',
  GET_LIST_BLOCK: '/api/getListBlock',
  REPORT_MISTAKE: '/api/question/update-report',
  SAVE_TO_DASHBOARD: '/pro-purchase-events',
  UPDATE_LOGIN: '/api/app/flutter',
};

export const I_GAME_TYPE = {
  study: 'study',
  practiceTest: 'practiceTest',
  audio: 'audio',
  examModeSimulator: 'examModeSimulator',
  examModeFinal: 'examModeFinal',
  practiceModeRandom: 'practiceModeRandom',
  practiceModeWeak: 'practiceModeWeak',
  practiceModeHardest: 'practiceModeHardest',
  practiceModeFavorite: 'practiceModeFavorite',
  finalTest: 'finalTest',
  diagnosticTest: 'diagnosticTest',
  allQuestions: 'allQuestions',
  improvePassingProb: 'improvePassingProb',
} as const;

export type IGameType = keyof typeof I_GAME_TYPE; // Type cho gameType
