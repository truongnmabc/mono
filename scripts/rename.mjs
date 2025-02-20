import { readdir, rename } from 'fs/promises';
import { basename, extname, join } from 'path';

// Lấy đường dẫn thư mục hiện tại trong ESModule
const __dirname = '/home/dev-abc/Workspace/mono/';
// Định nghĩa thư mục chứa icon
const ICONS_DIR = join(__dirname, 'libs/asset/icon');

// Hàm đổi đuôi file từ .js thành .tsx
const renameFiles = async () => {
  try {
    const files = await readdir(ICONS_DIR);

    for (const file of files) {
      const oldPath = join(ICONS_DIR, file);

      // Kiểm tra file có đuôi .js không
      if (extname(file) === '.js') {
        const newPath = join(ICONS_DIR, `${basename(file, '.js')}.tsx`);

        await rename(oldPath, newPath);
        console.log(`Đã đổi: ${file} ➝ ${basename(newPath)}`);
      }
    }
  } catch (err) {
    console.error('Lỗi khi đổi tên file:', err);
  }
};

// Chạy script
renameFiles();
