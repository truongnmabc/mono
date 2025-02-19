import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { getDataAllApp, getDataSingleApp } from "./setup/fetchData.js";
import { appendJson, appendToEnvFile } from "./setup/utils.js";
const DATA_PATH = process.cwd();
const envFilePath = path.join(DATA_PATH, ".env.local");

const args = process.argv.slice(2);

const command = args[0];
const option = args[1];

const getAuth = () => {
    exec("npx auth secret");
};
const appendEnv = (appInfo, isSingle) => {
    if (fs.existsSync(envFilePath)) fs.unlinkSync(envFilePath);
    if (isSingle) appendToEnvFile("APP_ID", appInfo.appId);
    appendToEnvFile("NEXT_PUBLIC_APPLE_ID", "com.abc.asvabtestweb");
    appendToEnvFile("DEV_BASE_API", "http://localhost:3000/");
    appendToEnvFile("NEXT_PUBLIC_SECRET_KEY", "https://api.cdl-prep.com/");
    appendToEnvFile("NEXT_PUBLIC_WORDPRESS_API_URL", "ABCElearning2022");
    appendToEnvFile(
        "NEXT_PUBLIC_GOOGLE_ID",
        "792314426707-gp1p1ml492uqehflmnm96r6in0jait6n.apps.googleusercontent.com"
    );
    appendToEnvFile("NEXT_PUBLIC_API_URL", "https://asvab.cd.worksheetzone.org/");
    if (isSingle)
        appendToEnvFile("NEXT_PUBLIC_APP_SHORT_NAME", appInfo.appShortName);
};

const setupSingleApp = async () => {
    const appInfo = await getDataSingleApp(option);
    console.log("🚀 ~ setupSingleApp ~ appInfo:", appInfo);
    appendEnv(appInfo[0], true);
    getAuth();
    console.log("Setup completed successfully.");
};

const setupDynamicApp = async () => {
    const appInfo = await getDataAllApp();
    console.log("🚀 ~ setupDynamicApp ~ appInfo:", appInfo);
    appendEnv();
    getAuth();
    appendJson(appInfo);
    console.log("Setup completed successfully.");
};

const showHelper = () => {
    console.log(`
        Usage: yarn setup <command> [option]

        Commands:
        s    Setup single app. Requires an app  appShortName as the option.
            Example: yarn setup s <appId>
        d    Setup dynamic app. No option required.
            Example: yarn setup d

        Options:
        <appId>   The appShortName of the app you want to set up (required for single app setup).

        Examples:
        yarn setup s my-app-id     # Setup a single app with appShortName 'my-app-id'
        yarn setup d               # Setup dynamic app
    `);
};

// Check if no arguments are provided
if (!command) {
    console.error("❌ Error: No command provided.");
    showHelper();
    process.exit(1); // Exit the process with an error code
}

if (command === "s") {
    setupSingleApp();
} else if (command === "d") {
    setupDynamicApp();
} else {
    console.error(`❌ Error: Unknown command '${command}'`);
    showHelper();
    process.exit(1);
}
