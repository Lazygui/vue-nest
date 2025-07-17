import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

/**
 * 文件字段配置接口
 */
interface FileFieldConfig {
       fieldName: string;       // 文件字段名（表单中字段的 key）
       maxCount?: number;       // 最大允许文件数（可选，默认 1）
}

/**
 * 文件上传选项接口
 */
interface FileOptions {
       limits?: number;         // 文件大小限制（单位：MB，默认 10MB）
}

/**
 * 自定义文件上传校验装饰器
 * @param config 文件字段配置数组
 * @param options 文件上传选项
 */
export function FileValidation(
       config: string[] | FileFieldConfig[],
       options?: FileOptions
) {
       const normalizedConfig: FileFieldConfig[] =
              Array.isArray(config) && typeof config[0] === 'string'
                     ? (config as string[]).map((fieldName) => ({
                            fieldName,
                            maxCount: 1, // 默认 maxCount = 1
                     }))
                     : (config as FileFieldConfig[]);

       // 构建 FileFieldsInterceptor 所需的字段配置
       const fileFields = normalizedConfig.map((c) => ({
              name: c.fieldName,
              maxCount: c.maxCount || 1, // 确保 maxCount 至少为 1
       }));

       // 构建 Multer 的 limits 配置
       const multerLimits = {
              fileSize: 1024 * 1024 * (options?.limits || 10), // 默认 10MB
       };

       return applyDecorators(
              ApiConsumes('multipart/form-data'), // 声明接口接收 multipart/form-data
              UseInterceptors(
                     FileFieldsInterceptor(fileFields, {
                            storage: memoryStorage(),
                            limits: multerLimits,
                     })
              )
       );
}