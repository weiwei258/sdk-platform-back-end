import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Base } from './Base';
import Application from './Application';

@Entity()
class Resource extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  // AppId
  @Column('text')
  key: string;

  // appKey
  @Column('text')
  src: string;

  @ManyToOne(() => Application, application => application.appId)
  Applications: Application;
}

export default Resource;
