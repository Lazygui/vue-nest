# 构建阶段
FROM node:22-alpine AS builder
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制包管理相关文件
COPY package.json pnpm-lock.yaml* .npmrc* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码并构建
COPY . .
RUN pnpm build

# 生产阶段
FROM node:22-alpine
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制包管理相关文件
COPY package.json pnpm-lock.yaml* .npmrc* ./

# 仅安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 从构建阶段复制产出
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 9050
CMD ["node", "dist/main.js"]