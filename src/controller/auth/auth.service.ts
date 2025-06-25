// auth/auth.service
import { Injectable } from '@nestjs/common'
import { UserService } from '@controller/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from './crypto.service';
import { UserEntity } from '@/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private cryptoService: CryptoService
  ) { }

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ phone });
    if (user) {
      const { password, ...result } = user;
      if (await this.cryptoService.checkPassword(pass, password)) {
        return result;
      }
      return { password: pass };
    }
    return null;
  }

  async login(user: UserEntity) {
    const payload = { phone: user.phone, sub: user.user_id };
    return {
      token: this.jwtService.sign(payload),
      user_name: user.user_name,
      phone: user.phone
    };
  }
}
