import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class UserList {
       @ApiProperty({
              name: 'page_index',
              description: '页码',
              type: Number,
       })
       @IsNumber()
       @IsNotEmpty({ message: '页码不能为空' })
       page_index: number;

       @ApiProperty({
              name: 'page_size',
              description: '每页数量',
              type: Number,
       })
       @IsNumber()
       @IsNotEmpty({ message: '每页数量不能为空' })
       page_size: number

       @ApiProperty({
              name: 'id_card',
              description: '身份证号',
              required: false,
              type: String,
              default: ''
       })
       @IsOptional()
       @IsString()
       id_card: string
}
export class UserAdd {
       @ApiProperty({ uniqueItems: true, description: '手机号' })
       @IsNotEmpty({ message: '手机号不能为空' })
       @IsString()
       @IsMobilePhone('zh-CN', {}, { message: '手机号格式错误' })
       phone: string;


       @ApiProperty({ uniqueItems: false, description: '用户名' })
       @IsOptional()
       @IsString()
       user_name: string;
}