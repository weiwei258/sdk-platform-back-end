import { TransportCategory } from '@eagle-tracker/types';
import { IsNotEmpty } from 'class-validator';
import { AppConfig } from './application.dto';

export class LogsDTO {
  @IsNotEmpty({ message: '缺少写日志信息' })
  readonly data: string;

  @IsNotEmpty({ message: '缺少appId' })
  readonly appId: string;

  @IsNotEmpty({ message: '缺少appKey' })
  readonly appKey: string;
}


export class GetLogsDTO {
  @IsNotEmpty({ message: '缺少appId' })
  readonly appId: AppConfig['appId'];
  /**
   * 数据类型
   */
  @IsNotEmpty({ message: '缺少日志分类' })
  readonly category: TransportCategory;
}
