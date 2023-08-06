import { IsBooleanStringConstraint } from '@/validators/IsBooleanStringConstraint';
import { Validate } from 'class-validator';

export class ActiveDto {
  @Validate(IsBooleanStringConstraint)
  active!: boolean;
}
