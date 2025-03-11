import fs from 'fs-extra';
import path from 'path';

const ROOT_DIR = process.cwd();
const NEXT_BUILD_DIR = path.join(ROOT_DIR, 'dist/apps/single/.next');
const STANDALONE_DIR = path.join(NEXT_BUILD_DIR, 'standalone');
const OUTPUT_DIR = path.join(ROOT_DIR, 'output');

// Hàm copy thư mục
const copyDir = async (src, dest) => {
  try {
    await fs.copy(src, dest, { overwrite: true });
    console.log(`✅ Đã copy: ${src} → ${dest}`);
  } catch (err) {
    console.error(`❌ Lỗi khi copy ${src}:`, err);
  }
};

// Tạo thư mục output nếu chưa tồn tại
fs.ensureDirSync(OUTPUT_DIR);

// Copy các thư mục cần thiết
await copyDir(STANDALONE_DIR, OUTPUT_DIR);
await copyDir(
  path.join(NEXT_BUILD_DIR, 'static'),
  path.join(OUTPUT_DIR, '.next/static')
);
await copyDir(
  path.join(ROOT_DIR, 'apps/single/public'),
  path.join(OUTPUT_DIR, 'public')
);

// Tạo `start.sh` (cho Linux/macOS)
const startScript = `#!/bin/bash
PORT=3000 HOSTNAME=0.0.0.0 node server.js
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'start.sh'), startScript, {
  mode: 0o755,
});

// Tạo `start.bat` (cho Windows)
const startBat = `@echo off
set PORT=3000
set HOSTNAME=0.0.0.0
node server.js
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'start.bat'), startBat);

console.log('🎉 Build hoàn tất! Các file đã được copy vào thư mục output.');
