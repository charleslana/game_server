import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserCharacterNameDto {
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
}
