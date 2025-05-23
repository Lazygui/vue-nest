import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserList, UserAdd } from './dto/request-user.dto';
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post('list')
    getList(@Body() body: UserList) {
        const { page_index, page_size, id_card, phone, user_id } = body;
        return this.userService.findPaging(page_index, page_size, { id_card, phone, user_id });;
    }

    @Post('add')
    addUser(@Body() body: UserAdd) {
        return this.userService.create(body);
    }
}
