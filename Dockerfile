# ---- 第一阶段：构建阶段（使用官方 Node 镜像来编译 TypeScript）----
FROM node:22.18-slim AS builder

# 设置工作目录
WORKDIR /app

# 先只复制 package.json 和 package-lock.json（或 yarn.lock）
COPY package.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src/ ./src/

RUN npm install -g pnpm

# 安装所有依赖（包括开发依赖，因为要编译 TypeScript）
RUN pnpm  install

# 编译 NestJS 项目（生成 dist/ 目录）
RUN pnpm  run build

# ---- 第二阶段：运行阶段（使用更小的生产镜像）----
FROM node:22.18-slim

# 设置工作目录
WORKDIR /app

# 从第一阶段（builder）中拷贝 package.json
COPY --from=builder /app/package.json ./

RUN npm install

# 从第一阶段拷贝编译结果 dist/
COPY --from=builder /app/dist/ ./dist/

# 复制变量文件
COPY .env ./

ENV NODE_ENV=production
EXPOSE 9050

# 启动命令（Nest 生产模式）
CMD ["node", "dist/main"]