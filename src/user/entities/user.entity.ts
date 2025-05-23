import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class UserEntity {

       @CreateDateColumn({
              type: 'timestamp',
              nullable: false,
              name: 'create_time',
              comment: '创建时间',
       })
       createTime: Date;

       @UpdateDateColumn({
              type: 'timestamp',
              nullable: false,
              name: 'update_time',
              comment: '更新时间',
       })
       updateTime: Date;

       @PrimaryGeneratedColumn('identity', { name: 'user_id' })
       user_id: number;


       @IsNotEmpty({ message: '用户名不能为空' })
       @Column({ unique: false, nullable: false, comment: '用户名' })
       user_name: string;


       @IsOptional()
       @Column({ unique: true, nullable: true, comment: '身份证号' })
       id_card: string;


       @IsOptional()
       @Column({ unique: true, nullable: false, comment: '手机号' })
       phone: string;

       @DeleteDateColumn()
       @Column({ unique: false, nullable: true, comment: '软删除标志' })
       user_deletedAt: Date;
}
