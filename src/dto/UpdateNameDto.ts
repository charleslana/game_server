import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateNamedDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z ]*$/, {
    message: 'O nome deve conter apenas letras e espaços.',
  })
  @Transform(({ value }) => value?.trim())
  name!: string;
}
