import { Injectable } from '@nestjs/common';
import { AddUser } from './dto/request-user.dto';

@Injectable()
export class UserService {
       create(createUserDto: AddUser) {
              console.log(createUserDto);
              return 'This action adds a new user';
       }

       findAll() {
              return `This action returns all user`;
       }

       findOne(id: number) {
              return `This action returns a #${id} user`;
       }

       update(id: number, updateUserDto: any) {
              return `This action updates a #${id} user`;
       }

       remove(id: number) {
              return `This action removes a #${id} user`;
       }
}
