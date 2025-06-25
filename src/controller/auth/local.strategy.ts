import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
       constructor(private authService: AuthService) {
              super({ usernameField: 'phone' })
       }

       async validate(phone: string, password: string): Promise<any> {
              const user = await this.authService.validateUser(phone, password)
              if (!user) {
                     throw new UnauthorizedException('手机号未注册')
              }
              if (user.password && user.password === password) {
                     throw new UnauthorizedException('密码错误')
              }
              return user
       }
}
