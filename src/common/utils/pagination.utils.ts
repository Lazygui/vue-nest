import { isEmpty } from 'class-validator';
import { Repository, FindManyOptions, ObjectLiteral, FindOptionsOrder, Like, FindOneOptions, EntityManager, QueryRunner } from 'typeorm';

/**
 * 分页查询公共函数
 * @param repository TypeORM 的 Repository 实例
 * @param page 当前页码，默认值为 1
 * @param limit 每页记录数，默认值为 10
 * @param sortBy 排序字段，默认值为 'update_time'
 * @param order 排序方式，默认值为 'ASC'
 * @param options 其他查询选项，支持以下参数：
 *   - **where**: `Object`，指定查询条件，用于过滤数据。例如：`where: { name: 'John' }`。
 *   - **select**: `string[]`，指定返回的字段。例如：`select: ['id', 'name']`。
 *   - **relations**: `string[]`，加载关联实体。例如：`relations: ['profile']`。
 *   - **cache**: `boolean` 或 `number`，启用查询缓存。例如：`cache: true`。
 *   - **withDeleted**: `boolean`，是否包含软删除的记录。例如：`withDeleted: true`。
 *   - **loadRelationIds**: `boolean`，查询结果会包含关联实体的 ID，而不是完整的关联实体。例如：`loadRelationIds: true`。
 *   - **loadEagerRelations**: `boolean`，是否加载使用 `@Eager（用于标记某些关联实体是否总是需要自动加载的装饰器） `注解的关联实体。例如：`loadEagerRelations: true`。
 *   - **join**: `Object`，指定 JOIN 查询。例如：`join: { alias: 'user', leftJoinAndSelect: { profile: 'user.profile' } }`。
 *   - **comment**: `string`，在生成的 SQL 查询中添加注释。例如：`comment: 'This is a test query'`。
 *   - **lock**: `Object`，锁定查询结果。例如：`lock: { mode: 'pessimistic_write' }`。
 *   - **relationsLoadStrategy**: `'join' | 'query'`，指定加载关联实体的策略。例如：`relationsLoadStrategy: 'join'`。
 *   - **relationLoadStrategy**: `'join' | 'query'`，与 `relationsLoadStrategy` 相同，用于兼容性。
 *   - **relationPreloadStrategy**: `'join' | 'query'`，与 `relationsLoadStrategy` 相同，用于兼容性。
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

/**
 * 查询指定数据的函数
 * @param repository TypeORM 的 Repository 实例
 * @param options 查询选项，支持以下参数：
 *   - **where**: `Object`，指定查询条件，用于过滤数据。例如：`where: { name: 'John' }`。
 *   - **select**: `string[]`，指定返回的字段。例如：`select: ['id', 'name']`。
 *   - **relations**: `string[]`，加载关联实体。例如：`relations: ['profile']`。
 *   - **cache**: `boolean` 或 `number`，启用查询缓存。例如：`cache: true`。
 *   - **withDeleted**: `boolean`，是否包含软删除的记录。例如：`withDeleted: true`。
 *   - **loadRelationIds**: `boolean`，查询结果会包含关联实体的 ID，而不是完整的关联实体。例如：`loadRelationIds: true`。
 *   - **loadEagerRelations**: `boolean`，是否加载使用 `@Eager` 注解的关联实体。例如：`loadEagerRelations: true`。
 *   - **join**: `Object`，指定 JOIN 查询。例如：`join: { alias: 'user', leftJoinAndSelect: { profile: 'user.profile' } }`。
 *   - **comment**: `string`，在生成的 SQL 查询中添加注释。例如：`comment: 'This is a test query'`。
 *   - **lock**: `Object`，锁定查询结果。例如：`lock: { mode: 'pessimistic_write' }`。
 *   - **relationsLoadStrategy**: `'join' | 'query'`，指定加载关联实体的策略。例如：`relationsLoadStrategy: 'join'`。
 *   - **relationLoadStrategy**: `'join' | 'query'`，与 `relationsLoadStrategy` 相同，用于兼容性。
 *   - **relationPreloadStrategy**: `'join' | 'query'`，与 `relationsLoadStrategy` 相同，用于兼容性。
 * @returns 查询到的数据，如果没有找到则返回 `null`
 */
export async function findOneData<T extends ObjectLiteral>(
       repository: Repository<T>,
       options: FindOneOptions<T> = {},
): Promise<T | null> {
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
       const findOptions: FindOneOptions<T> = {
              ...options,
              where: Object.keys(where).length > 0 ? where : undefined, // 如果 where 条件不为空，则加入查询
       };
       // 执行查询
       const data = await repository.findOne(findOptions);
       // 返回结果
       return data || null;
}

/**
 * 执行 SQL 语句的函数
 * @param manager EntityManager 实例
 * @param sql 要执行的 SQL 语句
 * @param params SQL 语句中的参数（可选）
 * @returns 执行结果
 * @throws 如果执行过程中发生错误，抛出异常
 */
export async function executeSQL<T = any>(
       manager: EntityManager,
       sql: string,
       params?: any[]
): Promise<T[]> {
       const queryRunner: QueryRunner = manager.connection.createQueryRunner();

       try {
              // 开始事务
              await queryRunner.startTransaction();

              // 执行 SQL 语句
              const result = await queryRunner.query(sql, params);

              // 提交事务
              await queryRunner.commitTransaction();

              // 返回结果
              return result;
       } catch (error) {
              // 回滚事务
              await queryRunner.rollbackTransaction();
              // 抛出异常
              throw new Error(`SQL 执行失败: ${error.message}`);
       } finally {
              // 释放 QueryRunner
              await queryRunner.release();
       }
}