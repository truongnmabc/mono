# Base image
FROM node:18-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package.json, package-lock.json, và NX workspace.json để cài đặt dependencies
COPY package.json pnpm-lock.yaml nx.json ./
COPY apps/single/package.json ./apps/single/

# Install dependencies (chỉ cài đặt dependencies cần thiết)
RUN pnpm i --frozen-lockfile

# Copy toàn bộ workspace nhưng bỏ qua node_modules và output
COPY . .

# Build Next.js ở chế độ standalone
RUN npx nx build single --configuration=production

# ---- Production Image ----
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy standalone output từ giai đoạn build
COPY --from=builder /app/dist/apps/single/.next/standalone ./
COPY --from=builder /app/dist/apps/single/.next/static ./static
COPY --from=builder /app/dist/apps/single/public ./public
COPY --from=builder /app/apps/single/package.json ./package.json
# Install only production dependencies

# Expose port 3000
EXPOSE 3000

# Start the Next.js server
CMD ["node", "server.js"]
