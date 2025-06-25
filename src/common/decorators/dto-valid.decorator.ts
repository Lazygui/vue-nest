import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidationOptions, IsNumber, IsBoolean, IsDate, IsOptional } from 'class-validator';

/**
 * DtoValid 装饰器的配置选项
 */
interface DtoValidOptions {
       /** 属性名称（用于标识） */
       name: string;
       /** 属性描述（用于 Swagger 文档和验证消息） */
       description: string;
       /** 属性的类型*/
       type: StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor;
       /** 是否不能为空，默认为 true */
       isNotEmpty?: boolean;
}

/**
 * 自定义dto属性装饰器 DtoValid
 * 用于为 DTO 属性自动应用 Swagger 文档和验证规则。
 *
 * @param options 配置选项
 * @returns PropertyDecorator
 *
 * 功能：
 * 1. 根据 `type` 自动应用类型验证装饰器（如 `@IsString()`、`@IsNumber()` 等）。
 * 2. 根据 `isNotEmpty` 决定是否应用 `@IsNotEmpty()` 或 `@IsOptional()`。
 * 3. 自动生成 Swagger 文档（`@ApiProperty`）。
 *
 * 示例：
 * ```typescript
 * class CreateUserDto {
 *   @DtoValid({ name: 'username', description: '用户名', isNotEmpty: true, type: String })
 *   username: string;
 *
 *   @DtoValid({ name: 'age', description: '年龄', isNotEmpty: false, type: Number })
 *   age: number;
 *
 *   @DtoValid({ name: 'isActive', description: '是否激活', isNotEmpty: false, type: Boolean })
 *   isActive: boolean;
 *
 *   @DtoValid({ name: 'createdAt', description: '创建时间', isNotEmpty: false, type: Date })
 *   createdAt: Date;
 * }
 * ```
 */
export function DtoValid(options: DtoValidOptions): PropertyDecorator {
       const { description, isNotEmpty = true, type } = options;

       const apiPropertyOptions: ApiPropertyOptions = {
              description,
              type,
              required: isNotEmpty
       };

       const validationOptions: ValidationOptions = {
              message: `${description}不能为空`,
       };

       let validationDecorator: any = () => { };

       if (type === String) {
              validationDecorator = IsString();
       } else if (type === Number) {
              validationDecorator = IsNumber();
       } else if (type === Boolean) {
              validationDecorator = IsBoolean();
       } else if (type === Date) {
              validationDecorator = IsDate();
       }

       const decorators = [
              ApiProperty(apiPropertyOptions),
              isNotEmpty ? IsNotEmpty(validationOptions) : IsOptional(),
              validationDecorator,
       ];

       return applyDecorators(...decorators);
}


import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);