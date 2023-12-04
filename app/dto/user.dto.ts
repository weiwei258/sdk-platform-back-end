import { IsNotEmpty } from 'class-validator';

export class CheckTokenDTO {
  @IsNotEmpty({ message: '请输入token' })
  readonly token: string;
}
