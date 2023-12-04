import { IsNotEmpty } from 'class-validator';
import User from '../entities/User';
import { UserPermissions } from '../types/permission';

export class TokenIncludeInfo {
  @IsNotEmpty({ message: 'id can not be empty' })
  readonly id: User['id'];

  @IsNotEmpty({ message: 'account can not be empty' })
  readonly account: User['account'];

  @IsNotEmpty({ message: 'nickname can not be empty' })
  readonly nickname: User['nickname'];

  permission: UserPermissions;
}
