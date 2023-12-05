import { IsNotEmpty } from 'class-validator';

export class UploadForPlatformDTO {
  @IsNotEmpty({ message: '缺少appId' })
  readonly appId: string;
}

export class UploadForPlugin {
  @IsNotEmpty({ message: '缺少appId' })
  readonly appId: string;

  @IsNotEmpty({ message: '缺少appKey' })
  readonly appKey: string;
}
