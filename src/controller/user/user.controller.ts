import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { UserList } from './dto/request-user.dto';
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post('list')
    @HttpCode(HttpStatus.OK)
    getList(@Body() body: UserList) {
        const { page_index, page_size, id_card, phone } = body;
        return this.userService.findPaging(page_index, page_size, { id_card, phone });;
    }
}
