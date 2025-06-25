import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@controller/user/user.module';
import { AuthController } from './auth.controller';
import { CryptoService } from './crypto.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    UserModule, PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, CryptoService, JwtStrategy],
})
export class AuthModule { }
