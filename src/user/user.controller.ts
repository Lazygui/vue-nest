import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get('profile')
    getProfile(): string {
        return '用户藏三';
    }
    @Post('register')
    registerUser(@Body() userData: any) {
        console.log('收到注册数据:', userData, process.env.DB_HOST);
        return { success: true, userId: 123 };
    }

    // 动态路由参数 /users/orders/789
    @Get('orders/:orderId')
    getOrder(@Param('orderId') orderId: string) {
        return `查询订单${orderId}的详细信息`;
    }
}
