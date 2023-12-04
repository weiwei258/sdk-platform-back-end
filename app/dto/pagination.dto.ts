import { IsNotEmpty } from 'class-validator';

export class PaginationDto {
  @IsNotEmpty({ message: 'current can not be empty' })
  readonly current: number;

  @IsNotEmpty({ message: 'pageSize can not be empty' })
  readonly pageSize: number;
}
