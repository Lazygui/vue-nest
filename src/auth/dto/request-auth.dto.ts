
import { DtoValid } from "@common/decorators/dto-valid.decorator"
export class SignUp {
       @DtoValid({ name: 'phone', description: '电话号码', type: String })
       phone: string

       @DtoValid({ name: 'password', description: '密码', type: String })
       password: string
}
