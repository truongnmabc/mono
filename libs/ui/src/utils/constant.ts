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
    facebook: 'https://www.facebook.com/CDL-prep-101878645343877',
    twitter: 'https://twitter.com/CLprep',
    youtube: 'https://www.youtube.com/channel/UCke4KGWOxPP8R2aPVQTUAlA',
    linkedin: '',
    email: 'support@cdl-prep.com',
  },
  asvab: {
    facebook: 'https://www.facebook.com/profile.php?id=61564203283376',
    twitter: 'https://x.com/AsvabPrep2024',
    youtube: 'https://www.youtube.com/@ASVABPrep',
    email: 'support@asvab-prep.com',
  },
  dmv: {
    facebook: 'https://www.youtube.com/channel/UClGYoBo4B7IoffZXcwDdRUw',
    twitter: 'https://twitter.com/dmvprepabcteam',
    email: 'support@dmv-practicetests.com',
  },
  cna: {
    email: 'support@cna-prep.com',
  },
  drivingtheory: {
    email: 'support@drivingtheory-tests.com',
  },
  passemall: {
    facebook: 'https://www.facebook.com/ABC-E-learning-110654290809849',
    twitter: 'https://twitter.com/passemall',
    email: 'support@passemall.com',
    reddit: 'https://new.reddit.com/user/passemall',
  },
  realestate: {
    facebook:
      'https://www.facebook.com/Real-Estate-Exam-Prep-by-ABC-Elearning-107910338185108',
    youtube: 'https://www.youtube.com/channel/UCFWA5MkzvzHlHYBFvT9BH9A/about',
    email: 'support@realestate-prep.com',
  },
  servsafe: {
    facebook: 'facebook.com/Servsafe-Exam-Prep-104667911889218',
    youtube: 'https://www.youtube.com/channel/UC7A8HrEXgdiR7otcxgAqZZQ/about',
    email: 'support@servsafe-prep.com',
  },
  aws: {
    facebook: 'https://www.facebook.com/AWS-Exam-Prep-102525238774581',
    youtube: 'https://www.youtube.com/channel/UCht1edKzc3jXi6RHu-kAXRA/about',
    email: 'support@aws-prep.com',
  },
  ptce: {
    facebook:
      'https://www.facebook.com/PTCB-Exam-Prep-by-ABC-Elearning-102646622056698',
    youtube: 'https://www.youtube.com/channel/UCwk8caoOY4DiyteWcv17nbQ/about',
    email: 'support@ptceprep.com',
  },
  pmp: {
    facebook: 'https://www.facebook.com/PMP-Exam-Prep-100596645638322',
    youtube: 'https://www.youtube.com/channel/UCv3MA6wPjfvmctrQbrrWYrQ/about',
    email: 'support@pmp-testprep.com',
  },
  ged: {
    facebook: 'https://www.facebook.com/people/TestPrep-Ged/100068351480720/',
    youtube: 'https://www.youtube.com/channel/UCsVHfTGvOjveDJSx6c4hdNQ/about',
    email: 'support@ged-testprep.com',
  },
  teas: {
    facebook: 'https://www.facebook.com/TEAS-Exam-Prep-113142767696481',
    email: 'support@teas-prep.com',
  },
};
export const ONE_WEEK_PRO = 'oneWeekPro';
export const ONE_MONTH_PRO = 'oneMonthPro';
export const ONE_YEAR_PRO = 'oneYearPro';
export const ONE_TIME_PRO = 'oneTimePro';
export const SUBSCRIPTION = 'subcription';
export const ONETIME = 'onetime';
