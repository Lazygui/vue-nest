import { Injectable } from '@nestjs/common';
import { UserEntity } from '@db/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from "@common/utils/pagination.utils"

@Injectable()
export class UserService {
       constructor(
              @InjectRepository(UserEntity)
              private readonly userRepository: Repository<UserEntity>,
       ) { }

       async findAll() {
              return await this.userRepository.find();
       }


       /**
        * 分页查询
        * @param pageIndex 页码
        * @param pageSize 每页条数
        * @param serch 查询条件
        */
       async findPaging(pageIndex: number, pageSize: number, serch: { id_card?: string, phone?: string }) {
              return await paginate(this.userRepository, pageIndex, pageSize, { where: serch })
       }
}
