import { IsInt, IsPositive, Max, Min } from 'class-validator';

export class CreateUserCharacterGroupDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  groupId!: number;
}
