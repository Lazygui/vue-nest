import { PartialType } from '@nestjs/mapped-types';
import { RequestUserList } from './request-user.dto';

export class UpdateUserDto extends PartialType(RequestUserList) { }
