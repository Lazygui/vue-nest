import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('/')//挂载前端页面
  getAdmin(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'wwwroot', 'index.html'));
  }
}
