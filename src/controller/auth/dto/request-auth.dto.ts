
import { DtoValid } from "@common/decorators/dto-valid.decorator"
import { IsPhoneNumber, Matches } from "class-validator"
export class SignUp {
       @DtoValid({ name: 'phone', description: '电话号码', type: String })
       @IsPhoneNumber('CN', { message: '无效的电话号码' })
       phone: string

       @DtoValid({ name: 'password', description: '密码', type: String })
       // @Matches(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/, { message: '密码必须包含至少一个数字、一个字母，并且长度至少为8个字符。' })
       password: string
}
