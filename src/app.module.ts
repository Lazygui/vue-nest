import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from "./user/user.module"
import { HtmlModule } from './html/html.module';
import { ConfigModule } from './config/config.controller';

@Module({
  imports: [
    ConfigModule,
    HtmlModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
