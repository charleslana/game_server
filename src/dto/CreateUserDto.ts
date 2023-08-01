import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O campo "email" deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo "email" não pode estar vazio.' })
  @IsEmail(
    {},
    { message: 'O campo "email" deve ser um endereço de email válido.' }
  )
  @MaxLength(100, {
    message: 'O campo "email" deve ter no máximo 100 caracteres.',
  })
  email!: string;

  @IsString({ message: 'O campo "senha" deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo "senha" não pode estar vazio.' })
  @MinLength(6, {
    message: 'O campo "senha" deve ter no mínimo 6 caracteres.',
  })
  password!: string;

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
