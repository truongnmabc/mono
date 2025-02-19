import axios from "axios";

export async function getDataSingleApp(appName) {
    const url = `https://api-cms-v2-dot-micro-enigma-235001.appspot.com/api/app/config/get-all-web-config?bucket=${appName}`;
    const response = await axios.get(url);
    return response.data;
}

export async function getDataTopicsAndTest(appName) {
    const url = `https://storage.googleapis.com/micro-enigma-235001.appspot.com/${appName}/web-data/all-data.json?t=${new Date().getTime()}`;
    const response = await axios.get(url);
    return response.data;
}

export async function getDataSeo(appName) {
    const url = `https://api.asvab-prep.com/wp-json/passemall/v1/get-info-state?stateSlug=${appName}`;
    const response = await axios.get(url);
    return response.data;
}

export async function getDataTopics({ bucket, state, appInfoBucket }) {
    const response = await axios.get(
        "https://storage.googleapis.com/micro-enigma-235001.appspot.com/" +
            bucket +
            appInfoBucket +
            state +
            "/topics-and-tests.json?t=" +
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
                headers: { "Content-Type": "application/json" },
            }
        );
        return appInfosResponse.data;
    } catch (error) {
        console.error("Error during 'passemall' download:", error);
    }
}
