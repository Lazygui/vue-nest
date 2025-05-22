import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
       imports: [
              ServeStaticModule.forRoot({
                     rootPath: join(__dirname, '..', 'wwwroot'), // 指向 wwwroot 文件夹
                     exclude: ['/api*'],                        // 排除API路由
              }),
       ],
       controllers: [],
       providers: [],
})
export class HtmlModule { }
