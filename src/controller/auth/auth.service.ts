// auth/auth.service
import { Injectable } from '@nestjs/common'
import { UserService } from '@controller/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private cryptoService: CryptoService
  ) { }

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ phone });
    if (user && await this.cryptoService.checkPassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { phone: user.phone, sub: user.userId };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
