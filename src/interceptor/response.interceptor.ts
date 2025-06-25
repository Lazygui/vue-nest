import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
       intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
              const httpContext = context.switchToHttp();
              const response = httpContext.getResponse();

              return next.handle().pipe(
                     map(data => ({
                            code: response.statusCode, // 动态获取状态码
                            message: 'success',
                            data,
                     })),
              );
       }
}