import { Repository, ObjectLiteral } from 'typeorm';

/**
 * 软删除指定数据的函数
 * @param repository TypeORM 的 Repository 实例
 * @param id 要软删除的记录的主键
 * @returns 返回软删除操作的结果
 */
export async function softDelete<T extends ObjectLiteral>(
       repository: Repository<T>,
       id: string | number,
): Promise<'软删除成功' | '软删除失败'> {
       try {
              // 执行软删除操作
              const result = await repository.softDelete(id);

              // 检查是否成功删除
              if (result.affected && result.affected > 0) {
                     return '软删除成功';
              } else {
                     return '软删除失败';
              }
       } catch (error) {
              throw new Error('软删除操作失败：', error);
       }
}