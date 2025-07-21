# 基础镜像：优先使用 22.13.1（若存在），否则用 22-alpine3.21（你的可用版本）
FROM node:22-alpine3.21

# 设置工作目录
WORKDIR /app

# 复制关键文件（按需加载优化镜像层）
COPY package*.json ./
# 安装生产依赖（--production 跳过开发依赖）
RUN npm install --production

COPY dist/ ./dist/
COPY certs/ ./certs/
COPY client/ ./client/
COPY .env ./
COPY db.sqlite ./

ENV NODE_ENV=production
ENV PORT=9050
# 暴露 Nest 默认端口（9050）
EXPOSE 9050

# 启动命令（Nest 生产模式）
CMD ["node", "dist/main"]