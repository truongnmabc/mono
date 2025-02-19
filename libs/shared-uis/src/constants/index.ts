export type IContactInfo = {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    email?: string;
    reddit?: string;
};
type ListContactApp = {
    [key: string]: IContactInfo;
};
export const listContactApp: ListContactApp = {
    cdl: {
        facebook: "https://www.facebook.com/CDL-prep-101878645343877",
        twitter: "https://twitter.com/CLprep",
        youtube: "https://www.youtube.com/channel/UCke4KGWOxPP8R2aPVQTUAlA",
        linkedin: "",
        email: "support@cdl-prep.com",
    },
    asvab: {
        facebook:
            "https://www.facebook.com/ASVAB-Test-Prep-by-ABC-Elearning-104795498352899",
        twitter: "https://twitter.com/PrepAsvab",
        youtube: "https://www.youtube.com/channel/UC9F-vTfB9PCbxvBT8zqMMJw",
        email: "support@asvab-prep.com",
    },
    dmv: {
        facebook: "https://www.youtube.com/channel/UClGYoBo4B7IoffZXcwDdRUw",
        twitter: "https://twitter.com/dmvprepabcteam",
        email: "support@dmv-practicetests.com",
    },
    cna: {
        email: "support@cna-prep.com",
    },
    drivingtheory: {
        email: "support@drivingtheory-tests.com",
    },
    passemall: {
        facebook: "https://www.facebook.com/ABC-E-learning-110654290809849",
        twitter: "https://twitter.com/passemall",
        email: "support@passemall.com",
        reddit: "https://new.reddit.com/user/passemall",
    },
    realestate: {
        facebook:
            "https://www.facebook.com/Real-Estate-Exam-Prep-by-ABC-Elearning-107910338185108",
        youtube:
            "https://www.youtube.com/channel/UCFWA5MkzvzHlHYBFvT9BH9A/about",
        email: "support@realestate-prep.com",
    },
    servsafe: {
        facebook: "facebook.com/Servsafe-Exam-Prep-104667911889218",
        youtube:
            "https://www.youtube.com/channel/UC7A8HrEXgdiR7otcxgAqZZQ/about",
        email: "support@servsafe-prep.com",
    },
    aws: {
        facebook: "https://www.facebook.com/AWS-Exam-Prep-102525238774581",
        youtube:
            "https://www.youtube.com/channel/UCht1edKzc3jXi6RHu-kAXRA/about",
        email: "support@aws-prep.com",
    },
    ptce: {
        facebook:
            "https://www.facebook.com/PTCB-Exam-Prep-by-ABC-Elearning-102646622056698",
        youtube:
            "https://www.youtube.com/channel/UCwk8caoOY4DiyteWcv17nbQ/about",
        email: "support@ptceprep.com",
    },
    pmp: {
        facebook: "https://www.facebook.com/PMP-Exam-Prep-100596645638322",
        youtube:
            "https://www.youtube.com/channel/UCv3MA6wPjfvmctrQbrrWYrQ/about",
        email: "support@pmp-testprep.com",
    },
    ged: {
        facebook:
            "https://www.facebook.com/people/TestPrep-Ged/100068351480720/",
        youtube:
            "https://www.youtube.com/channel/UCsVHfTGvOjveDJSx6c4hdNQ/about",
        email: "support@ged-testprep.com",
    },
    teas: {
        facebook: "https://www.facebook.com/TEAS-Exam-Prep-113142767696481",
        email: "support@teas-prep.com",
    },
};

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const RANDOM_COLORS = [
    "#30749F",
    "#E68A4F",
    "#309F98",
    "#8CCAC7",
    "#DAB542",
    "#656C86",
    "#789A6B",
    "#859051",
    "#CCA68B",
    "#4fdbb7",
    "#962434",
    "#729e1d",
    "#eaae2a",
    "#86b5fe",
    "#c7be6d",
    "#e46873",
    "#a5b34f",
    "#43c59e",
    "#984fe6",
    "#4a2267",
    "#11c8c4",
    "#579362",
    "#b95226",
    "#8f6232",
    "#5d9133",
    "#97af7a",
    "#7b9bd1",
    "#c9c695",
];

export const timeCaching = 1 * 1000 * 60 * 60;

export const isProduction = process.env.NODE_ENV === "production";

export const listAppState = ["cdl"];

export const TypeParam = {
    diagnosticTest: "diagnostic_test",
    finalTest: "final_test",
    customTest: "custom_test",
    practiceTest: "practice_test",
    review: "review",
};

export const baseImageUrl =
    "https://storage.googleapis.com/micro-enigma-235001.appspot.com/";

// Constants
export const ONE_WEEK_PRO = "oneWeekPro";
export const ONE_MONTH_PRO = "oneMonthPro";
export const ONE_YEAR_PRO = "oneYearPro";
export const ONE_TIME_PRO = "oneTimePro";
export const SUBSCRIPTION = "subcription";
export const ONETIME = "onetime";

export const PAYPAL_SUBSCRIPTION_CLIENT_ID = isProduction
    ? "AdB2eO_M5-okrwgabqjSMgbxuJGSXuw7tOTXNIPonty8TiHtCTZGjIErVHaBRYhsGQWNYZQjQlq4tJat"
    : "AVyimUfmrrnWOGW7GFSXlYm77H4O-JvvRBSBMqBDNj1_ATxF-hRsccOmXxx8lenoD1SND5UjC-MlY9Jm";

export const PAYPAL_SUBSCRIPTION_KEY = "subcription_key";

export const PAYPAL_CLIENT_ID = isProduction
    ? "AdB2eO_M5-okrwgabqjSMgbxuJGSXuw7tOTXNIPonty8TiHtCTZGjIErVHaBRYhsGQWNYZQjQlq4tJat"
    : "ASZuK4V1rzGFj333OzSTQM_TeNeD7VWkhTCUjoy2y6p7dgbIAoSYTSGaKwMGiGVoaHMxC-Mdb8D3wa3E";

export const PAYPAL_CURRENCY = "USD";

export const HTTP_REQUEST_SUCCESS = 200;

export const HTTP_REQUEST_TIMEOUT = 30000;

export const BASE_WP = "https://api.cdl-prep.com";

export const PURCHASED = 1;

export const BASE_URL = "https://test-dot-micro-enigma-235001.appspot.com";

export const BASE_URL_PROP =
    "https://api-cms-v2-dot-micro-enigma-235001.appspot.com";

export const BASE_URL_DEV = "https://dev-dot-micro-enigma-235001.appspot.com";

export const DASHBOARD_API = `https://dashboard-api2.abc-elearning.org/`;

export const KEY_CLICK_ADS = "sdakcilc";

export const MAX_CLICK_ADS_PER_USER = 3;

export const BASE_STORE_URL =
    "https://storage.googleapis.com/micro-enigma-235001.appspot.com";

export const I_GAME_TYPE = {
    study: "study",
    practiceTest: "practiceTest",
    audio: "audio",
    examModeSimulator: "examModeSimulator",
    examModeFinal: "examModeFinal",
    practiceModeRandom: "practiceModeRandom",
    practiceModeWeak: "practiceModeWeak",
    practiceModeHardest: "practiceModeHardest",
    practiceModeFavorite: "practiceModeFavorite",
    finalTest: "finalTest",
    diagnosticTest: "diagnosticTest",
    allQuestions: "allQuestions",
    improvePassingProb: "improvePassingProb",
} as const;

export type IGameType = keyof typeof I_GAME_TYPE; // Type cho gameType
