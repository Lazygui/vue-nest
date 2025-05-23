import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUp } from './dto/request-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //TODO 注册
  @Post('sign-up')
  signUp(@Body() createAuthDto: SignUp) {
    return this.authService.signUp(createAuthDto);
  }

}
