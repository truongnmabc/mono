import fs from 'fs';
import path from 'path';
export const getData = async (slug: string) => {
  const filePath = path.join(process.cwd(), '/src/data/seo.json');
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return jsonData.default[slug];
};
