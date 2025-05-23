import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from './base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
       /**
        * 用户ID
        */
       @PrimaryGeneratedColumn('identity', { name: 'user_id' })
       user_id: number;

       @Column({ type: 'varchar', unique: true, nullable: false, comment: '手机号' })
       phone: string;

       @Column({ type: 'varchar', unique: false, nullable: false, comment: '密码' })
       password: string;

       @Column({ type: 'varchar', unique: false, nullable: false, comment: '昵称' })
       user_name: string;

       @Column({ type: 'varchar', unique: true, nullable: true, comment: '身份证号' })
       id_card: string;

       @Column({ type: 'varchar', unique: false, nullable: true, comment: '真实姓名' })
       real_name: string;

       @Column({ type: 'varchar', unique: false, nullable: true, comment: '用户头像地址' })
       avatar_path: string;

       @Column({ type: 'varchar', unique: false, nullable: false, comment: '用户角色', default: 'user' })
       role: string;

       @DeleteDateColumn()
       @Column({ unique: false, nullable: true, comment: '软删除标志' })
       user_deletedAt: Date
}
