import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUp } from './dto/request-auth.dto';
import { UserEntity } from '@db/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '@controller/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { findOneData } from "@common/utils/pagination.utils"
import { Repository } from 'typeorm';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private usersService: UserService,
    private jwtService: JwtService,
    private cryptoService: CryptoService
  ) { }
  async signUpPhone(createAuthDto: SignUp) {
    const addUser = { ...createAuthDto, user_name: createAuthDto.phone }
    const user = await this.usersService.addUser(addUser);
    const payload = { sub: user.user_id, username: user.user_name, phone: user.phone };
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }

  async signInPhone(authDto: SignUp) {
    const user = await findOneData(this.userRepository, { where: { phone: authDto.phone } })
    //用户不存在时自动注册
    if (!user) {
      const hash_password = await this.cryptoService.careatePassword(authDto.password)
      return await this.signUpPhone({ ...authDto, password: hash_password })
      // throw new HttpException('用户不存在，请先注册', HttpStatus.BAD_REQUEST)
    }
    const hash_password = await this.cryptoService.checkPassword(authDto.password, user.password)
    if (hash_password) {
      const payload = { sub: user.user_id, username: user.user_name, phone: user.phone };
      return {
        access_token: await this.jwtService.signAsync(payload)
      }
    }
    throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
  }
}
