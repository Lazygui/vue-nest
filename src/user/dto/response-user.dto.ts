import { PartialType } from '@nestjs/mapped-types';
import { UserList } from './request-user.dto';

export class UpdateUserDto extends PartialType(UserList) { }
