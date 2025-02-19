import path from "path";
import fs from "fs";

const DATA_PATH = process.cwd();
const envFilePath = path.join(DATA_PATH, ".env.local");
const fileConfigCss = path.join(DATA_PATH, "/src/css/config.css");
const fileJsonPath = path.join(DATA_PATH, "/src/data/dynamic/appInfos.json");
export const appendToEnvFile = (key, value) => {
    fs.appendFileSync(envFilePath, `${key}=${value}\n`);
};

export const _genStudyLink = (appShortName, tag, fullTest, _state = "") => {
    // trong đường dẫn có cả thành phần state
    let url = "";
    if (!fullTest) {
        url = tag;
        if (!tag?.includes(appShortName)) url = appShortName + "-" + url;
        if (!tag?.includes("practice")) url = url + "-" + "practice-test";
        if (_state)
            url = url.replace(appShortName, _state + "-" + appShortName);
    } else {
        if (!!tag)
            url = `full-length-${
                _state ? _state + "-" + appShortName : appShortName
            }-${tag}-practice-test`;
        // trường hợp full-length test
        else
            url = `full-length-${
                _state ? _state + "-" + appShortName : appShortName
            }-practice-test`; // trường hợp full-length test
    }
    // trường hợp branch

    url = url //update 23/4
        .split("-")
        .filter((_) => !!_ && !!_.trim())
        .join("-");

    if (appShortName !== "asvab") url = url.replaceAll(appShortName, "");
    url = "/" + url;
    return url;
};

// function genConfigApp({
//   appId,
//   gaId,
//   googleVerifyId,
//   appName,
//   mainColor,
//   mainBackgroundColor,
//   tagManagerId,
//   GA4ID,
//   mainColorBold,
//   appleClientId,
// }) {
//   const timeBuild = Date.now();

//   const configContent = `
//   export const APP_NEW_DOMAIN = '${appId}';
//   export const GA_ID = '${gaId}';
//   export const APP_SHORT_NAME = "${appName}";
//   export const TAG_MANAGER_ID = '${tagManagerId}';
//   export const VERSION = 0;
//   export const GOOGLE_SITE_VERIFICATION = '${googleVerifyId}';
//   export const MAIN_COLOR = '${mainColor}';
//   export const MAIN_COLOR_BOLD = '${mainColorBold}';
//   export const MAIN_BACKGROUND_COLOR = '${mainBackgroundColor}';
//   export const PAGE_ID = '${process.env.PAGE_ID || ""}';
//   export const APPLE_CLIENT_ID = '${appleClientId}';
//   export const TIME_BUILD = ${timeBuild};
//   export const GA4_ID = '${
//     process.env.NEXT_PUBLIC_WEB_PROD === "production" ? GA4ID : "G-LTT5WBKQ7T"
//   }';
//   export const WORDPRESS_DOMAIN = '${process.env.WORDPRESS_DOMAIN || ""}';
//   `;

//   fs.writeFileSync(fileConfigApp, configContent.trim());
// }

export function genConfigCssApp({
    mainCss,
    mainBackgroundColor,
    mainCssBold,
    cookie,
    bgColorStartTest,
    bgColorCloseCookie,
    mainColorUpgradePro,
    colorClockDiscount,
}) {
    const cssContent = `
  :root {
    --main-color: ${mainCss.replace(/[^a-zA-Z0-9#]/g, "")};
    --main-color-bold: ${mainCssBold.replace(/[^a-zA-Z0-9#]/g, "")};
    --main-background-color: ${mainBackgroundColor.replace(
        /[^a-zA-Z0-9#]/g,
        ""
    )};
    --cookie: ${cookie.replace(/[^a-zA-Z0-9#]/g, "")};
    --bg-color-start-test: ${bgColorStartTest.replace(/[^a-zA-Z0-9#]/g, "")};
    --bg-color-close-cookie: ${bgColorCloseCookie.replace(
        /[^a-zA-Z0-9#]/g,
        ""
    )};
    --main-color-upgrade-pro: ${mainColorUpgradePro.replace(
        /[^a-zA-Z0-9#]/g,
        ""
    )};
    --color-clock-discount: ${colorClockDiscount.replace(/[^a-zA-Z0-9#]/g, "")};
    --font-family: 'Poppins', sans-serif; /* Trong file build.sh */
  }
  `;

    fs.writeFileSync(fileConfigCss, cssContent.trim());
}

export const saveJSONFile = (filePath, data) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const copyFolder = (source, destination) => {
    if (fs.existsSync(destination)) {
        fs.rmdirSync(destination, { recursive: true });
        console.log(`Deleted existing folder: ${destination}`);
    }
    fs.mkdirSync(destination, { recursive: true });
    fs.promises.cp(source, destination, { recursive: true }).then(() => {
        console.log(`Copied content from ${source} to ${destination}`);
    });
};

export const appendJson = (data) => {
    try {
        if (fs.existsSync(fileJsonPath)) fs.unlinkSync(fileJsonPath);
        fs.writeFileSync(fileJsonPath, JSON.stringify(data, null, 2));
        console.log(`Successfully appended data to ${fileJsonPath}`);
    } catch (error) {
        console.error(`Error appending data to JSON file: ${error.message}`);
    }
};
