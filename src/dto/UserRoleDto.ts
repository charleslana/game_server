import UserRoleEnum from '@/enum/UserRoleEnum';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '@/entities/User';

export class UserRoleDto {
  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsNotEmpty()
  user!: User;
}
