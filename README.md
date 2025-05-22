## 目录说明

```
src/
├── html
│   └── html.module.ts         # HTML模块，包含HTML相关控制器和业务逻辑
├── user                       # User模块(示例模块,其余类似模块不做说明)  
│   ├── user.controller.ts     # User控制器，处理用户相关的HTTP请求
│   ├── user.module.ts         # User模块，组织用户功能的组件
│   └── user.service.ts        # UserService服务，实现用户业务逻辑
├── app.controller.spec.ts     # App控制器单元测试文件
├── app.controller.ts          # 根控制器，通常处理基础路由
├── app.module.ts              # 根模块，组织所有功能模块
├── main.ts                    # 应用入口文件,设置服务端口,除'/'路由之外的路由均添加api前缀(/api/user/**)
└── config
    ├── config.controller.ts   # 配置控制器，TypeOrm连接配置、env文件等
```

## 如何启动

#### 安装依赖

`pnpm install`

#### 启动服务

`pnpm run start:dev`

#### Docker部署

请先安装Docker
`docker-compose up -d --build`
