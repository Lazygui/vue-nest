import { PartialType } from '@nestjs/swagger';
import { SignUp } from './request-auth.dto';

export class UpdateAuthDto extends PartialType(SignUp) { }
