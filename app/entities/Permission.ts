import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Application from './Application';
import { Base } from './Base';
import User from './User';
import { Name } from '../types/permission';

@Entity()
class Permission extends Base {

  @PrimaryGeneratedColumn()
  id: number;

  // 昵称
  @Column('text')
  name: Name;

  @Column('text')
  type: 'platform' | 'app';

  @ManyToOne(() => User, user => user.permissions)
  user: User;

  @ManyToOne(() => Application, application => application.permissions)
  application: Application;
}

export default Permission;
