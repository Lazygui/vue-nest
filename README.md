## Directory Structure

```
src/
├── html
│   └── html.module.ts        # HTML模块，包含HTML相关控制器和业务逻辑
├── user
│   ├── user.controller.spec.ts  # User控制器单元测试文件
│   ├── user.controller.ts       # User控制器，处理用户相关的HTTP请求
│   ├── user.module.ts           # User模块，组织用户功能的组件
│   └── user.service.ts          # UserService服务，实现用户业务逻辑
├── app.controller.spec.ts     # App控制器单元测试文件
├── app.controller.ts          # 根控制器，通常处理基础路由
├── app.module.ts              # 根模块，组织所有功能模块
├── main.ts                    # 应用入口文件，创建并启动NestJS服务器
├── aaa
│   ├── dto
│   │   ├── create-aaa.dto.ts  # 创建AAA实体的数据传输对象（DTO）
│   │   └── update-aaa.dto.ts  # 更新AAA实体的数据传输对象（DTO）
│   └── entities
│       └── aaa.entity.ts      # AAA实体类，定义数据库模型
└── config
    ├── config.controller.ts   # 配置控制器，处理配置相关的HTTP请求
    └── config.controller.spec.ts # 配置控制器的单元测试文件
```

## Getting Started

For details on how to run the application and execute tests, please refer to the original documentation below.
