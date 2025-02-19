const DATA_PATH = process.cwd();
import path from "path";
import fs from "fs";

export const getListApps = async () => {
  try {
    const listAppsPath = path.join(
      DATA_PATH,
      "/src/common/data/constant/listApps.json"
    );
    const listApps = await fs.promises.readFile(listAppsPath, "utf-8");
    return JSON.parse(listApps);
  } catch (error) {
    console.error("Error reading listApps.json:", error);
  }
};
