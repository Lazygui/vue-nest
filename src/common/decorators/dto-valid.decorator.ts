import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidationOptions, IsNumber, IsArray, IsBoolean, IsDate, IsOptional, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, IsObject, validate, ValidateNested } from 'class-validator';
/**
 * DtoValid 装饰器的配置选项
 */
interface DtoValidOptions {
       /** 属性名称（用于标识） */
       name: string;
       /** 属性描述（用于 Swagger 文档和验证消息） */
       description: string;
       /** 属性的类型*/
       type: StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | ObjectConstructor | ArrayConstructor | 'File' | 'DateNumber';
       /** 是否不能为空，默认为 true */
       isNotEmpty?: boolean;
       // 用于嵌套 DTO 验证
       dtoClass?: any;
}

/**
 * 自定义dto属性装饰器 DtoValid
 * 用于为 DTO 属性自动应用 Swagger 文档和验证规则。
 *
 * @param options 配置选项
 * @returns PropertyDecorator
 *
 * 功能：
 * 1. 根据 `type` 自动应用类型验证装饰器（如 `@IsString()`、`@IsNumber()` 等）'File' 类型使用不添加验证器，DateNumber 类型使用自定义验证器。
 * 2. 根据 `isNotEmpty` 决定是否应用 `@IsNotEmpty()` 或 `@IsOptional()`。
 * 3. 自动生成 Swagger 文档（`@ApiProperty`）。
 * 4. 添加嵌套 DTO 验证（如果需要）。
 * 5. 存储 DtoValid 的配置到元数据中，用于后续处理。
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
 * 
 *   *需要配合controller使用@FileValidation自定义装饰器
 *   @DtoValid({ name: 'createdAt', description: '头像', type: 'Files' }) 
 *   createdAt: Express.Multer.File;
 * }
 * ```
 */
export function DtoValid(options: DtoValidOptions): PropertyDecorator {
       const { description, isNotEmpty = true, type, dtoClass } = options;
       const apiType = type === 'File' ? 'string' :
              type === 'DateNumber' ? 'number' : // 处理 DateNumber 类型
                     type// 其他类型保持原样
       const apiPropertyOptions: ApiPropertyOptions = {
              description,
              type: apiType,
              required: isNotEmpty,
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
       } else if (type === 'DateNumber') {
              validationDecorator = IsDateNumber();
       } else if (type === Array) {
              validationDecorator = IsArray();
       } else if (type === Object) {
              validationDecorator = IsObject(); // 新增：对象类型使用 @IsObject()
              if (dtoClass) {
                     // ✅ 直接使用 @ValidateNested()，不再手动调用 validate
                     validationDecorator = ValidateNested();
              }

       }
       // 如果 type 是 File，则不添加验证装饰器

       const decorators = [
              ApiProperty(apiPropertyOptions),
       ];
       if (type !== 'File') {
              decorators.push(isNotEmpty ? IsNotEmpty(validationOptions) : IsOptional());
              decorators.push(validationDecorator);
              if (type === Object && dtoClass) {
                     decorators.push(Type(() => dtoClass));
              }
       }

       // return applyDecorators(...decorators);
       return (target: Object, propertyKey: string | symbol) => {
              // 应用所有生成的装饰器
              decorators.forEach(dec => dec(target, propertyKey));
              // 存储DtoValid的配置到元数据中（键为'dtoValid:options'）
              Reflect.defineMetadata('dtoValid:options', options, target, propertyKey);
       };
}
@ValidatorConstraint({ name: 'IsDateNumber' })
class IsDateNumberConstraint implements ValidatorConstraintInterface {
       validate(value: any): boolean {
              // 必须是正整数
              return typeof value === 'number' && Number.isInteger(value) && value > 0;
       }

       defaultMessage(): string {
              return '必须是一个有效的正整数时间戳';
       }
}
function IsDateNumber(validationOptions?: ValidationOptions) {
       return function (object: Object, propertyName: string) {
              registerDecorator({
                     target: object.constructor,
                     propertyName: propertyName,
                     options: validationOptions,
                     constraints: [],
                     validator: IsDateNumberConstraint,
              });
       };
}