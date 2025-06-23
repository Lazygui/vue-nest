import { Injectable } from '@nestjs/common';
import { SignUp } from './dto/request-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) { }
  async signUpPhone(createAuthDto: SignUp) {
    const addUser = { ...createAuthDto, user_name: createAuthDto.phone }
    const user = await this.usersService.addUser(addUser);
    const payload = { sub: user.user_id, username: user.user_name };
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
