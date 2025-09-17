import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Inject, HttpStatus, BadRequestException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';
import { QueryFailedError, getMetadataArgsStorage } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
       private fieldMeaningMap: { [key: string]: string } = {};
       constructor() {
              this.buildFieldMeaningMap()
       }
       catch(exception: Error, host: ArgumentsHost) {
              const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
              const ctx = host.switchToHttp();
              const response = ctx.getResponse<Response>();
              const request = ctx.getRequest(); // 获取请求对象
              const path = request.route?.path || request.originalUrl; // 更安全的方式

              let status = 500;
              let message = 'Internal server error';

              if (exception instanceof HttpException) {

                     status = exception.getStatus();

                     const response = exception.getResponse();
                     message = typeof response === 'string' ? response : response['message'] || 'Unknown error';
                     if (response['errno']) {
                            const regex = /UNIQUE constraint failed: (.+)/;
                            const match = response['message'].match(regex);
                            message = `${this.fieldMeaningMap[match![1]] || match![1] || '字段'} 已存在`
                     } else if (response['error']) {
                            if (response['error'] === 'Payload Too Large') {
                                   message = '资源过大'
                            }
                     }

              } else if (exception instanceof QueryFailedError) {
                     message = this.handleQueryFailedError(exception);
              } else if (exception instanceof AxiosError) {
                     status = 502; // Bad Gateway
                     message = this.handleAxiosError(exception)
              } else {
                     message = exception.message || 'Internal server error';
              }

              console.error(`[${timestamp}] ${status}: ${message}`);


              response.status(status).json({
                     code: status,
                     timestamp,
                     path, // 加入路由路径
                     message,
              });
       }

       /**
           * 处理 AxiosError 的私有方法
           * @param exception AxiosError 实例
           * @returns 错误信息
           */
       private handleAxiosError(exception: AxiosError): string {
              let info = '';
              // 处理 SQLite 错误码
              switch (exception.code) {
                     case 'ETIMEDOUT':
                            info = '请求超时'
                            break
                     case 'EAI_AGAIN':
                            info = '无法解析服务地址（DNS 错误）'
                            break
                     default:
                            info = '无法连接到服务，请稍后再试';
                            break
              }

              return info
       }
       /**
                  * 处理 QueryFailedError 的私有方法
                  * @param exception QueryFailedError 实例
                  * @returns 错误信息
                  */
       private handleQueryFailedError(exception: QueryFailedError): string {
              const driverError = exception.driverError as unknown as { errno: number; message: string };
              const errorCode = driverError.errno;
              const errorMessage = driverError.message;
              let info = 'Internal server error';
              // 处理 SQLite 错误码
              switch (errorCode) {
                     case 5:
                     case 6:
                            info = '数据库或表被锁定'
                            break
                     case 12:
                            info = '未找到'
                            break
                     case 14:
                            info = '无法打开数据库'
                            break
                     case 19:
                            const regex = /UNIQUE constraint failed: (.+)/;
                            const match = errorMessage.match(regex);
                            info = `${this.fieldMeaningMap[match![1]] || match![1] || '字段'} 已存在`
                            break
                     case 20: // SQLITE_MISMATCH
                            info = '数据类型不匹配'
                            break
                     default:
                            info = 'Database error: ' + errorMessage;
                            break
              }

              return info
       }
       private buildFieldMeaningMap(): void {
              const metadata = getMetadataArgsStorage();
              const fieldMeaningMap: { [key: string]: string } = {};

              // 遍历所有实体类
              metadata.tables.forEach(table => {
                     const tableName = table.name;

                     // 遍历所有字段
                     metadata.columns.forEach(column => {
                            if (column.target === table.target) {
                                   const fieldName = `${tableName}.${column.propertyName}`;
                                   const fieldComment = column.options.comment || column.propertyName;
                                   fieldMeaningMap[fieldName] = fieldComment;
                            }
                     });
              });

              // 缓存映射表
              this.fieldMeaningMap = fieldMeaningMap;
       }
}