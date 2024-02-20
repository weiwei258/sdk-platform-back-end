import { Service } from 'egg';
import LogsEntity from '../entities/Logs';
import { TransportStructure } from '@eagle-tracker/types';
import { GetLogsDTO } from '../dto/logs.dto';

export class LogsService extends Service {

  public async save(dataStr: string) {
    const { Logs } = this.ctx.repo;
    const logs = new LogsEntity();
    const structure: TransportStructure = JSON.parse(dataStr);
    logs.appId = structure.appId;
    logs.dataStr = dataStr;
    logs.category = structure.category;
    logs.logTime = new Date(structure.timestamp);

    await Logs.save(logs);
    return 'ok';
  }

  public async getLogList(params: GetLogsDTO) {
    const { category, appId, dateRange } = params;
    const { Logs } = this.ctx.repo;

    const today = new Date(); // 获取当前日期和时间
    const startDate = new Date(dateRange ? dateRange[0] : new Date); // 创建一个新的日期对象，初始值为当前日期和时间
    const endDate = dateRange ? dateRange[1] : new Date()

    if (!dateRange) {
      startDate.setDate(today.getDate() - 90); // 使用 `setDate` 方法将日期设置为前N天
    }

    const list = await Logs.createQueryBuilder('logs')
      .where('logs.appId = :appId', { appId })
      .andWhere('logs.category = :category', { category }) // 添加分类过滤条件
      .andWhere('logs.createTime >= :startDate', { startDate }) // 添加起始日期条件
      .andWhere('logs.createTime <= :endDate', { endDate }) // 添加结束日期条件
      .getMany();

    return list.map(item => JSON.parse(item.dataStr));
  }
}


export default LogsService;
