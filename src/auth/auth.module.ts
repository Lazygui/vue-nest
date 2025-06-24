import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CryptoService } from './crypto.service';
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, CryptoService],
})
export class AuthModule { }
