import fs from "fs";
import path from "path";
import {
    getDataSingleApp,
    getDataTopicsAndTest,
    getDataSeo,
} from "./setup/fetchData.js";

const args = process.argv.slice(2);
const appName = args[0];
const DATA_PATH = process.cwd();
const rootPath = path.join(DATA_PATH, "src", "data", "home");

const filePaths = {
    appInfos: path.join(rootPath, "appInfos.json"),
    topics: path.join(rootPath, "topics.json"),
    seo: path.join(rootPath, "seo.json"),
};

const writeFileSafely = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const handleInitData = async (appName) => {
    try {
        const [data, topics, seo] = await Promise.all([
            getDataSingleApp(appName),
            getDataTopicsAndTest(appName),
            getDataSeo(appName),
        ]);

        writeFileSafely(filePaths.appInfos, data[0]); // `data[0]` thay vì `...data` để tránh lỗi format
        writeFileSafely(filePaths.topics, topics);
        writeFileSafely(filePaths.seo, seo);

        console.log("✅ Dữ liệu đã được khởi tạo thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi khởi tạo dữ liệu:", error);
    }
};

handleInitData(appName);
