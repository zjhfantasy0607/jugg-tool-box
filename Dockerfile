# 使用官方的 Node.js 镜像作为基础镜像
FROM node:18 AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（或者 yarn.lock）
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install

# 复制整个项目
COPY . .

# 生成 Next.js 的生产版本
RUN yarn build

# 使用一个新的镜像来运行应用
FROM node:18-slim

ENV NODE_ENV=production

# 设置工作目录
WORKDIR /app

# 复制 build 文件和必要的文件
COPY --from=builder /app ./

# 暴露端口
EXPOSE 3000

# 启动 Next.js 应用
CMD ["yarn", "start"]