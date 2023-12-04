import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { TransportCategory } from '@eagle-tracker/types';

@Entity()
class Logs extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  appId:string;

  @Column('text')
  dataStr:string;

  /**
   * 上报数据的类型
   */
  @Column('text')
  category: TransportCategory;

  /**
   * 时间戳
   */
  @Column('text')
  logTime:Date;
}

export default Logs;
