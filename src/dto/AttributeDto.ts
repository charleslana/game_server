import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class AttributeDto {
  characterId!: number;
  userId!: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(999)
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  strength?: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(999)
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  intelligence?: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(999)
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  dexterity?: number;
}
