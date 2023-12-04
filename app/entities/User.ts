import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Permission from './Permission';
import { Base } from './Base';

@Entity()
class User extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  // 昵称
  @Column('text')
  nickname: string;

  // 用户名
  @Column('text')
  account: string;

  // 加密后的密码
  @Column('text', { select: false })
  @Exclude()
  password: string;

  // 加密盐
  @Column('text', { select: false })
  @Exclude()
  salt: string;

  // 权限
  @OneToMany(() => Permission, permission => permission.user)
  permissions: Permission[];
}

export default User;
