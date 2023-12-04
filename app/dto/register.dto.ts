// src/modules/user/dto/register.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty({ message: '请输入账号名' })
  readonly account: string;

  @IsNotEmpty({ message: '请输入用户昵称' })
  @IsString({ message: '名字必须是 String 类型' })
  readonly nickname: string;

  @IsNotEmpty({ message: '请输入密码' })
  readonly password: string;
}
