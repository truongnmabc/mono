# Sử dụng base image của Node.js
FROM node:22-alpine AS base

# Thiết lập user để tăng bảo mật
USER node

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy toàn bộ nội dung từ thư mục output vào thư mục làm việc
COPY --chown=node:node ../output /app/

# Thiết lập biến môi trường
ENV PORT=3000
EXPOSE 3000

# Chạy ứng dụng với Next.js standalone
CMD ["node", "server.js"]
