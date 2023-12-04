import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Base } from './Base';
import Resource from './Resource';
import Permission from './Permission';

@Entity()
class Application extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  // AppId
  @Column('text')
  appId: string;

  // appKey
  @Column('text')
  appKey: string;

  @OneToMany(() => Resource, resource => resource.id)
  resource: Resource;

  @OneToMany(() => Permission, permission => permission.application)
  permissions: Permission[];
}

export default Application;
