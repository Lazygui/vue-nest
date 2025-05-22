import { Injectable } from '@nestjs/common';
import { UserAdd } from './dto/request-user.dto';
import { UserEntity } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
       constructor(
              @InjectRepository(UserEntity)
              private readonly userRepository: Repository<UserEntity>,
       ) { }
       async create(createUserDto: UserAdd) {
              const user = this.userRepository.create(createUserDto);
              await this.userRepository.save(user);
              console.log(createUserDto);
       }

       async findAll() {
              return await this.userRepository.find();
       }
}
