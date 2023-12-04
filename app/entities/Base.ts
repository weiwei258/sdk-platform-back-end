import { Transform, TransformFnParams } from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class Base {

  // 创建时间
  @Transform((row: TransformFnParams) => +new Date(row.value))
  @CreateDateColumn()
  createTime: Date;

  // 更新时间
  @Transform((row: TransformFnParams) => +new Date(row.value))
  @UpdateDateColumn()
  updateTime: Date;

  // 更新次数
  @VersionColumn()
  version: number;
}

