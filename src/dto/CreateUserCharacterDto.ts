import { Character } from '@/entities/Character';
import { Transform } from 'class-transformer';
import { User } from '@/entities/User';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserCharacterDto {
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

  // @IsEnum(BreedEnum)
  // @IsNotEmpty()
  // breed!: BreedEnum;

  character!: Character;

  user!: User;
}
