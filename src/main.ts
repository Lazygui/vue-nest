import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { createSwaggerDocument } from './config/swagger.config';
import { TransformInterceptor } from '@interceptor/response.interceptor';
import { HttpExceptionFilter } from '@filter/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  // 启用 CORS
  app.enableCors({
    methods: 'GET,POST'
  });
  //验证器，仅处理第一个错误
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const firstError = errors[0];
      if (firstError.constraints) {
        const message =
          firstError.constraints[Object.keys(firstError.constraints)[0]];
        return new BadRequestException(message);
      }
      return new BadRequestException('参数错误');
    },
  }));
  /**
   * 给所有接口添加前缀api
   * 排除html转发接口
   */
  app.setGlobalPrefix('/api', {
    exclude: ['/'], // 排除根路径
  });

  // 注册全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 注册全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  createSwaggerDocument(app)
  await app.listen(process.env.PORT ?? 9050);
}
void bootstrap();
