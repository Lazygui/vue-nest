import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from "@controller/user/user.module"
import { HtmlModule } from './html/html.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from '@controller/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    HtmlModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
