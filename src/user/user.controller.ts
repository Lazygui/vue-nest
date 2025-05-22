import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserList } from './dto/request-user.dto';
import { UserAdd } from './dto/request-user.dto';
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post('list')
    getList(@Body() body: UserList) {
        return this.userService.findAll();;
    }

    @Post('add')
    addUser(@Body() body: UserAdd) {
        return this.userService.create(body);
    }
}
