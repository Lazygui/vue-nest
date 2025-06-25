import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from "@controller/user/user.module"
import { HtmlModule } from './html/html.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from '@controller/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/guard/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    HtmlModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule { }
