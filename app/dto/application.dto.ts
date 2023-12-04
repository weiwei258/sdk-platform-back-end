import { IsNotEmpty } from 'class-validator';

export class CreateApplication {
  @IsNotEmpty({ message: '请输入app name' })
  readonly name: string;
}

export class DeleteApplication {
  @IsNotEmpty({ message: '请输入appId' })
  appId: string;
}

export class AppConfig {
  @IsNotEmpty({ message: '输入appId' })
  readonly appId: string;

  @IsNotEmpty({ message: '输入appKey' })
  readonly appKey: string;
}

export class AppInfoConfig {
  @IsNotEmpty({ message: '输入appId' })
  readonly appId: string;
}
