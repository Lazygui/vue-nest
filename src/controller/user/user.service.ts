import { Injectable } from '@nestjs/common';
import { UserEntity } from '@db/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { paginate } from "@common/utils/pagination.utils"
import { Public } from '@/common/decorators/dto-valid.decorator';

@Injectable()
export class UserService {
       constructor(
              @InjectRepository(UserEntity)
              private readonly userRepository: Repository<UserEntity>,
              private readonly dataSource: DataSource, // 注入 DataSource
       ) { }
       async addUser(createUserDto: Partial<UserEntity>) {
              const queryRunner = this.dataSource.createQueryRunner();
              await queryRunner.connect();
              await queryRunner.startTransaction();
              try {
                     const user = this.userRepository.create(createUserDto);
                     await queryRunner.manager.save(user);
                     await queryRunner.commitTransaction();
                     return user;
              } catch (error) {
                     await queryRunner.rollbackTransaction();
                     throw error;
              } finally {
                     await queryRunner.release();
              }
       }

       async findAll() {
              return await this.userRepository.find();
       }
       async findOne(where: any) {
              return await this.userRepository.findOne({ where });
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

       // private readonly users = [
       //        {
       //               userId: 1,
       //               phone: '15642532452',
       //               password: 'changeme',
       //        },
       //        {
       //               userId: 2,
       //               phone: 'maria',
       //               password: 'guess',
       //        },
       // ]

       // async findOne(phone: string): Promise<any | undefined> {
       //        return this.users.find(user => user.phone === phone)
       // }
}
