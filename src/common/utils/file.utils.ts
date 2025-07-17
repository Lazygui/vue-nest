
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs/promises';
import { join } from 'path';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
interface FileOptions {
       isEmpty?: boolean;
       targetDir?: string
}
/**
 * 保存上传的文件到指定目录
 * @param file Multer 文件对象
 * @param targetDir 目标目录路径
 * @returns 保存后的文件完整路径
 * @throws 如果文件保存失败会抛出异常
 */
export async function saveUploadedFile(file: Express.Multer.File | undefined, options: FileOptions = { isEmpty: false }): Promise<string | undefined> {

       if (options.isEmpty && !file) {
              return undefined
       }
       if (!file) {
              throw new BadRequestException('文件不能为空');
       }
       const filename = `${uuidv4()}.${file!.mimetype.split('/')[1]}`;
       // 目标目录，相对于项目根目录的 'static' 目录
       // 如果 options.targetDir 提供了，就使用它（也应该是相对于 'static' 的路径）
       let targetDir = 'static'; // 默认为空，表示直接放在 static 目录下

       if (options.targetDir) {
              targetDir = options.targetDir; // 例如 'images' 或 'videos'，将创建 static/images 或 static/videos
       }

       // 构建相对于 static 目录的文件路径
       const relativeFilePath = join(targetDir, filename);

       // 构建绝对路径，用于实际的文件系统操作
       const absoluteTargetDir = join(__dirname, '../../..', targetDir);
       const absoluteFilePath = join(__dirname, '../../..', targetDir, filename);

       try {
              // 确保目标目录存在
              await fs.mkdir(absoluteTargetDir, { recursive: true });
       } catch (err) {
              console.error('资源目录错误:', err);
              throw new BadRequestException('资源目录不存在！');
       }
       try {
              // 写入文件到绝对路径
              await fs.writeFile(absoluteFilePath, file.buffer);
              // 返回相对路径，这样前端可以拼接成完整的URL
              // 前端URL将是: http://localhost:9050/static/[targetDir]/[filename]
              return relativeFilePath;
       } catch (err) {
              console.error('文件写入失败:', err);
              throw new BadRequestException('文件保存失败');;
       }
}

/**
 * 删除文件
 * @param filePath 文件路径
 */
export async function deleteFile(filePath: string): Promise<void> {
       try {
              await fs.unlink(filePath);
       } catch (err) {
              if (err.code !== 'ENOENT') { // 忽略文件不存在的错误
                     console.error('删除文件失败:', err);
                     throw err;
              }
       }
}