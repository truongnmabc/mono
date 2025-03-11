import axios from 'axios';

// App info
export async function getDataSingleApp(appName) {
  const url = `https://api-cms-v2-dot-micro-enigma-235001.appspot.com/api/app/config/get-all-web-config?bucket=${appName}`;
  const response = await axios.get(url);
  return response.data;
}

// Topics and tests
export async function getDataTopicsAndTest(appName) {
  const url = `https://storage.googleapis.com/micro-enigma-235001.appspot.com/${appName}/web-data/all-data.json?t=${new Date().getTime()}`;
  const response = await axios.get(url);
  return response.data;
}

// Topics and tests
export async function getDataMember() {
  const url = `https://asvab-prep.com/wp-json/passemall/v1/get-all-members`;
  const response = await axios.get(url);
  return response.data;
}

// Seo content home page
export async function getDataSeo(appName) {
  const url = `https://api.asvab-prep.com/wp-json/passemall/v1/get-info-state?stateSlug=${appName}`;
  const response = await axios.get(url);
  return response.data;
}

export async function getQuestionByTopics(id) {
  const response = await axios.get(
    `https://storage.googleapis.com/micro-enigma-235001.appspot.com/asvab/web-data/topic-${id}.json?t=${new Date().getTime()}`
  );

  return response.data;
}

export async function getDataTopics({ bucket, state, appInfoBucket }) {
  const response = await axios.get(
    'https://storage.googleapis.com/micro-enigma-235001.appspot.com/' +
      bucket +
      appInfoBucket +
      state +
      '/topics-and-tests.json?t=' +
      new Date().getTime()
  );

  return response.data;
}

export async function getDataAllApp() {
  try {
    const appInfosResponse = await axios.post(
      `https://passemall.com/wp-json/passemall/v1/get-list-app`,
      {
        isParentApp: false,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return appInfosResponse.data;
  } catch (error) {
    console.error("Error during 'passemall' download:", error);
  }
}

export async function getSingleAppConfig(appName) {
  //   const url = `https://api-cms-v2-dot-micro-enigma-235001.appspot.com/api/app/config/get-all-web-config?bucket=${appName}`;
  //   const response = await axios.get(url);

  const data = [
    {
      gaId: 'UA-167769768-2',
      tagManagerId: 'GTM-WMWV374',
      appId: 4878338973761536,
      googleVerifyId: 'kS0dwjBOA9pZaStotM-lbFAW2fP7vk6-usRhQcPogw0',
      mainColor: '#7C6F5B',
      mainColorBold: '#443C2F',
      mainBackgroundColor: '#F9F7EE',
      mainBackgroundColorContact: '#7c6f5b0a',
      linearGradientBanner: 'linear-gradient(90deg, #FFEED5 0%, #FFFCD9 100%)',
      cookie: '#666444',
      GA4ID: 'G-REG5WF8B8P',
      pageId: '104795498352899',
      wpDomain: 'https://api.asvab-prep.com',
      bgColorStartTest: '#2F8966',
      bgColorCloseCookie: '#8A8862',
      mainColorUpgradePro: '#329678',
      colorClockDiscount: '#6e6c4a',
      appleClientId: 'com.abc.asvabtestweb',
    },
  ];

  return data;
}
