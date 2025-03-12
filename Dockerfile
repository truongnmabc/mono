# ---- Base Image ----
FROM node:18-alpine AS runner

# Bật Corepack để dùng pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json & lockfile để cài đặt dependencies
COPY dist/apps/single/package.json /app

# Chỉ cài dependencies cần thiết (production-only)
RUN pnpm install  --prod

# Sao chép output từ build local vào image
COPY dist/apps/single ./

# Sao chép thư mục chứa data (nếu có)
COPY apps/single/src/data ./src/data

ENV AUTH_SECRET="MPrwl23hdoo/TKD5l0Lb9n1Akexmq3iPkdEeH0J/Cjo="
# Expose port 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["pnpm", "next", "start", "-p", "3000"]
