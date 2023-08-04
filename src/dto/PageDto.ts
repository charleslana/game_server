import { IsInt, IsPositive, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PageDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page!: number;
}
