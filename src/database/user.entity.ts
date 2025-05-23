import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from './base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
       /**
        * 用户ID
        */
       @PrimaryGeneratedColumn('identity', { name: 'user_id' })
       user_id: number;


       @Column({ unique: false, nullable: false, comment: '用户名' })
       user_name: string;


       @Column({ unique: true, nullable: true, comment: '身份证号' })
       id_card: string;


       @Column({ unique: true, nullable: false, comment: '手机号' })
       phone: string;

       @DeleteDateColumn()
       @Column({ unique: false, nullable: true, comment: '软删除标志' })
       user_deletedAt: Date
}
