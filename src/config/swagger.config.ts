import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const swaggerConfig = new DocumentBuilder()
       .setTitle('API 文档')
       .setDescription('系统接口文档')
       .setVersion('1.0')
       .addBearerAuth({
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              in: 'header',
              name: 'Authorization',
       })
       .build();
export const createSwaggerDocument = app => {
       // 创建文档
       const document = SwaggerModule.createDocument(app, swaggerConfig)
       // 设置文档
       SwaggerModule.setup('docs', app, document)
}