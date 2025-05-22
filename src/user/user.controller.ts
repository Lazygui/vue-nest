import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RequestUserList } from './dto/request-user.dto';
import { AddUser } from './dto/request-user.dto';
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post('user-list')
    getList(@Body() body: RequestUserList): string {
        return '用户藏三';
    }

    @Post('user-add')
    addUser(@Body() body: AddUser) {
        return this.userService.create(body);
    }
}
