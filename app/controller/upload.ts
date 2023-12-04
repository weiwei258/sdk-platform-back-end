import { Controller } from 'egg';
import { moveFile } from '../utils/moveFile';
import { DefaultConfig } from '../../config/config.default';

// in controller
export default class UploadController extends Controller {

  public async index() {
    const { ctx } = this;
    const { path } = ctx.params;
    const { uploadFileabsolutePath } = this.config as any as DefaultConfig;
    const files = ctx.request.files; // 获取上传的文件
    console.log('path', path);

    // 处理上传的文件
    for (const file of files) {
      const filename = file.filename;
      const targetPath = `${uploadFileabsolutePath}/${filename}`;

      // 将文件移动到指定位置
      await moveFile(file.filepath, targetPath);
    }

    return true;
  }
}
