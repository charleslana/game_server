import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsPositive,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class AttributeDto {
  characterId!: number;
  userId!: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(999)
  @Transform(({ value }) => parseInt(value, 10))
  @ValidateIf(dto => !dto.intelligence && !dto.dexterity)
  @IsDefined({ message: 'At least one attribute field must be filled' })
  strength?: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(999)
  @Transform(({ value }) => parseInt(value, 10))
  @ValidateIf(dto => !dto.strength && !dto.dexterity)
  @IsDefined({ message: 'At least one attribute field must be filled' })
  intelligence?: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(999)
  @Transform(({ value }) => parseInt(value, 10))
  @ValidateIf(dto => !dto.strength && !dto.intelligence)
  @IsDefined({ message: 'At least one attribute field must be filled' })
  dexterity?: number;
}
