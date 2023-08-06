import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBooleanString', async: false })
export class IsBooleanStringConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (typeof value === 'boolean') {
      return true;
    }
    if (
      value === 'true' ||
      value === '1' ||
      value === 'false' ||
      value === '0'
    ) {
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid boolean string ('true', 'false', '1', or '0')`;
  }
}
