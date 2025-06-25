import { Controller, Post, HttpCode, HttpStatus, UseGuards, Request, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@/guard/local-auth.guard';
import { JwtAuthGuard } from '@/guard/jwt-auth.guard';
import { Public } from '@/common/decorators/dto-valid.decorator';
import { SignUp } from './dto/request-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signIn-phone')
  async sigIn(@Body() signUpDto: SignUp, @Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
