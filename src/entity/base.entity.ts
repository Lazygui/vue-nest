import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
       @CreateDateColumn({
              type: 'timestamp',
              nullable: false,
              name: 'create_time',
              comment: '创建时间',
       })
       create_time: Date;

       @UpdateDateColumn({
              type: 'timestamp',
              nullable: false,
              name: 'update_time',
              comment: '更新时间',
       })
       update_time: Date;
}