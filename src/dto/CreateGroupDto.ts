import { Transform } from 'class-transformer';
import { UserCharacter } from '@/entities/UserCharacter';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_ ]*$/, {
    message:
      'O nome deve conter apenas letras, números, espaços e sublinhados.',
  })
  @Transform(({ value }) => value?.trim())
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(4)
  @Matches(/^[a-zA-Z]*$/, {
    message: 'A tag deve conter apenas letras.',
  })
  @Transform(({ value }) => value?.trim().toUpperCase())
  tag!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[a-zA-Z0-9_ ]*$/, {
    message:
      'A descrição deve conter apenas letras, números, espaços e sublinhados.',
  })
  @Transform(({ value }) => value?.trim())
  description!: string;

  userCharacter!: UserCharacter;
}
