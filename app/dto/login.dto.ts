import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({ message: '请输入账号' })
  readonly account: string;

  @IsNotEmpty({ message: '请输入密码' })
  readonly password: string;
}
