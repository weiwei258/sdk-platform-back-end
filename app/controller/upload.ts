import { Controller } from 'egg';
import { deleteFile, getFileList, moveFile } from '../utils/fileOperations';
import { DefaultConfig } from '../../config/config.default';
import { validateParams } from '../utils/validator';
import { DeleteFileDTO, UploadForPlatformDTO, UploadForPlugin } from '../dto/upload.dto';
import { validateToken } from '../utils/validateToken';

// in controller
export default class UploadController extends Controller {

  public async index() {
    const { ctx } = this;
    // const { path } = ctx.params;
    const { uploadFileAbsolutePath } = this.config as any as DefaultConfig;
    const files = ctx.request.files; // 获取上传的文件

    console.log(files)
    // 处理上传的文件
    for (const file of files) {
      const filename = file.filename;
      const targetPath = `${uploadFileAbsolutePath}/${filename}`;

      // 将文件移动到指定位置
      await moveFile(file.filepath, targetPath);
    }

    return true;
  }

  /** 平台上传接口.map 文件接口 */
  public async uploadForPlatform() {
    const { ctx } = this;
    validateToken(ctx.header?.authorization);
    const { appId } = await validateParams(ctx.request.query, UploadForPlatformDTO);
    await ctx.service.application.validateHasApp(appId)

    const { mapFileAbsolutePath } = this.config as any as DefaultConfig;
    const files = ctx.request.files; // 获取上传的文件

    // 处理上传的文件
    for (const file of files) {
      const filename = file.filename;
      const targetPath = `${mapFileAbsolutePath}/${appId}/${filename}`;

      // 将文件移动到指定位置
      await moveFile(file.filepath, targetPath);
    }
    return true
  }

    /** 插件上传接口.map 文件接口 */
    public async uploadForPlugin() {

      const { ctx } = this;
      const { appId, appKey } = await validateParams(ctx.request.query, UploadForPlugin);
      await ctx.service.application.validateAppConfig({ appId, appKey })
      const { mapFileAbsolutePath } = this.config as any as DefaultConfig;
      const files = ctx.request.files; // 获取上传的文件

      // 处理上传的文件
      for (const file of files) {
        const filename = file.filename;
        const targetPath = `${mapFileAbsolutePath}/${appId}/${filename}`;

        // 将文件移动到指定位置
        await moveFile(file.filepath, targetPath);
      }
      return true
    }

  public async getFileList() {
    const { ctx } = this;
    validateToken(ctx.header?.authorization);
    const { appId } = await validateParams(ctx.request.query, UploadForPlatformDTO);
    await ctx.service.application.validateHasApp(appId)
    const { mapFileAbsolutePath } = this.config as any as DefaultConfig;
    const targetPath = `${mapFileAbsolutePath}/${appId}`
    return getFileList(targetPath)
  }

  public async deleteFile() {
    const { ctx } = this;
    validateToken(ctx.header?.authorization);
    const { appId, fileName } = await validateParams(ctx.request.query, DeleteFileDTO);
    await ctx.service.application.validateHasApp(appId)
    const { mapFileAbsolutePath } = this.config as any as DefaultConfig;
    const targetPath = `${mapFileAbsolutePath}/${appId}/${fileName}`
    deleteFile(targetPath)
    return 'ok'
  }
}
