
import { DtoValid } from "@common/decorators/dto-valid.decorator"
export class UserList {
       @DtoValid({ name: 'page_index', description: '页码', type: Number })
       page_index: number;

       @DtoValid({ name: 'page_size', description: '每页数量', type: Number })
       page_size: number

       @DtoValid({ name: 'id_card', description: '身份证号', type: String, isNotEmpty: false })
       id_card: string

       @DtoValid({ name: 'phone', description: '电话号码', type: String, isNotEmpty: false })
       phone: string
}