import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { createSwaggerDocument } from './config/swagger.config';
import { TransformInterceptor } from '@/interceptor/response.interceptor';
import { HttpExceptionFilter } from '@/filter/http-exception.filter';
import { join } from 'path';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  // 启用 CORS
  app.enableCors({
    origin: true,
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
    optionsSuccessStatus: 204,
  });
  const rootDir = join(__dirname, '..');
  app.use('/static', express.static(join(rootDir, '/static'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      }
    },
  }));
  //验证器，仅处理第一个错误
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      console.log(errors);

      const getFirstErrorMessage = (errors: any[]): string => {
        for (const error of errors) {
          if (error.constraints) {
            return Object.values(error.constraints)[0] as string;
          }
          if (error.children && error.children.length > 0) {
            const childMessage = getFirstErrorMessage(error.children);
            if (childMessage) {
              return childMessage;
            }
          }
        }
        return '参数错误';
      };

      const message = getFirstErrorMessage(errors);
      return new BadRequestException(message);
    },
    transform: true,
    whitelist: true,
  }));
  /**
   * 给所有接口添加前缀api
   * 排除html转发接口
   */
  app.setGlobalPrefix('/api');

  // 注册全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 注册全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  createSwaggerDocument(app)
  await app.listen(9050, '0.0.0.0');
}
void bootstrap();
