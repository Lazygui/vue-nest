import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from "@controller/user/user.module"
import { HtmlModule } from './html/html.module';
import { AuthModule } from '@controller/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/guard/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    HtmlModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'wwwroot'), // 指向 wwwroot 文件夹
      exclude: ['/api/*'],                        // 排除API路由
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log('===== 环境变量 =====');
        console.log('NODE_ENV:', config.get('NODE_ENV'));
        return {
          "type": "sqlite",
          "database": config.get('DB_DATABASE') || join(__dirname, 'db.sqlite'),
          entities: [__dirname + '../entity/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          // 开发环境关闭自动同步
          "synchronize": true
        }
      },
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule { }
