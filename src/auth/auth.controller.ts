import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUp } from './dto/request-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('signUp-phone')
  signUp(@Body() createAuthDto: SignUp) {
    return this.authService.signUpPhone(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn-phone')
  sigIn(@Body() authDto: SignUp) {
    return this.authService.signInPhone(authDto);
  }
}
