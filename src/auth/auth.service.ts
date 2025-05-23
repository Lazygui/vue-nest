import { Injectable } from '@nestjs/common';
import { SignUp } from './dto/request-auth.dto';

@Injectable()
export class AuthService {
  signUp(createAuthDto: SignUp) {
    return 'This action adds a new auth';
  }
}
