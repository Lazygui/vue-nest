import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * 给所有接口添加前缀api
   * 排除html转发接口
   */
  app.setGlobalPrefix('api', {
    exclude: ['/'], // 排除根路径
  });
  await app.listen(process.env.PORT ?? 9050);
}
void bootstrap();
