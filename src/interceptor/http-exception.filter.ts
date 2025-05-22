import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
       catch(exception: Error, host: ArgumentsHost) {
              const ctx = host.switchToHttp();
              const response = ctx.getResponse<Response>();
              const request = ctx.getRequest(); // 获取请求对象
              const path = request.route?.path || request.url; // 获取路由路径

              let status = 500;
              let message = 'Internal server error';
              if (exception instanceof HttpException) {
                     status = exception.getStatus();
                     message = exception.message;
              }

              // 生产环境建议隐藏堆栈信息
              console.error(`[${new Date().toISOString()}] Error: ${exception.stack}`);

              response.status(status).json({
                     code: status,
                     timestamp: new Date().toISOString(),
                     path, // 加入路由路径
                     message,
              });
       }
}