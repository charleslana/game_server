import { IsInt, IsPositive, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class IdDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  @Transform(({ value }) => parseInt(value, 10))
  id!: number;
}
