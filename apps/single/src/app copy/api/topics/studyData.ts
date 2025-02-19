import { promises as fs } from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const pathName = path.join(process.cwd(), "public/json/studyData.json");

    try {
        const fileContent = await fs.readFile(pathName, "utf-8");
        const data = JSON.parse(fileContent);
        res.status(200).json(data);
    } catch (error) {
        console.log("🚀 ~ error:", error);
        res.status(500).json({ error: "Failed to read appInfos.json" });
    }
}
