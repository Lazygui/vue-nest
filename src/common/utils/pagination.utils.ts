import { isEmpty } from 'class-validator';
import { Repository, FindManyOptions, ObjectLiteral, FindOptionsOrder, Like } from 'typeorm';

/**
 * 分页查询公共函数
 * @param repository TypeORM 的 Repository 实例
 * @param page 当前页码，默认值为 1
 * @param limit 每页记录数，默认值为 10
 * @param options 其他查询选项（如 where 条件、relations 等）
 * @param sortBy 排序字段，默认值为 'update_time'
 * @param order 排序方式，默认值为 'ASC'
 * @returns 包含数据列表和总数的对象
 */
export async function paginate<T extends ObjectLiteral>(
       repository: Repository<T>,
       page: number = 1,
       limit: number = 10,
       options: FindManyOptions<T> = {},
       sortBy: keyof T = 'update_time' as keyof T,
       order: 'ASC' | 'DESC' = 'ASC',
): Promise<{ data: T[]; total: number }> {
       // 计算跳过的记录数
       const skip = (page - 1) * limit;

       // 自动构建 where 条件
       const where = options.where ? { ...options.where } : {};

       // 过滤掉值为空字符串的字段，并对特定字段进行模糊查询
       for (const key in where) {
              if (isEmpty(where[key])) {
                     delete where[key];
              }
              if (typeof where[key] === 'string') {
                     where[key] = Like(`%${where[key]}%`); // 对非空字符串字段启用模糊查询
              }
       }

       // 构建查询选项
       const findOptions: FindManyOptions<T> = {
              ...options,
              skip,
              take: limit,
              order: {
                     [sortBy]: order,
              } as FindOptionsOrder<T>,
              where: Object.keys(where).length > 0 ? where : undefined, // 如果 where 条件不为空，则加入查询
       };

       // 执行查询
       const [data, total] = await repository.findAndCount(findOptions);

       // 返回结果
       return { data, total };
}