// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

const env = process.env.NODE_ENV || 'development';
@Module({
       imports: [
              NestConfigModule.forRoot({
                     isGlobal: true, // 设置为全局模块
                     envFilePath: [
                            `.env.${env}`,  // 环境专属配置（如 .env.production）
                            '.env'          // 通用配置（可选后备文件）
                     ]
              }),
              TypeOrmModule.forRootAsync({
                     useFactory: () => ({
                            type: 'postgres',
                            host: process.env.DB_HOST, // 数据库机地址
                            port: +process.env.DB_PORT!,
                            username: process.env.DB_USERNAME,
                            password: process.env.POSTGRES_PASSWORD,
                            database: process.env.DB_DATABASE,
                            synchronize: true,             // 开发环境开启自动同步
                            autoLoadEntities: true,
                     })
              })
       ],
})
export class ConfigModule { }