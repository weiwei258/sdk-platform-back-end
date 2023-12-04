// app/extend/helper.ts

import * as fs from 'fs';
import * as path from 'path';

export async function moveFile(sourcePath: string, targetPath: string) {
  const targetDir = path.dirname(targetPath);

  // 检查目标文件夹是否存在，如果不存在则创建
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(targetPath);

    readStream.pipe(writeStream);

    readStream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);
  });
}
