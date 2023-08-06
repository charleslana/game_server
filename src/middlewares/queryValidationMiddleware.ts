import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyRequest } from 'fastify';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export async function queryValidationMiddleware<T extends object>(
  type: new () => T,
  request: FastifyRequest
): Promise<ErrorResponse | undefined> {
  if (!request.query) {
    return new ErrorResponse('Requisição sem query string.');
  }
  const dto: T = plainToClass(type, request.query);
  const errors: ValidationError[] = await validate(dto);
  if (errors.length > 0) {
    const validationErrors = errors.map(error =>
      Object.values(error.constraints ?? {}).join(', ')
    );
    const errorMessage = validationErrors.join(', ');
    return new ErrorResponse(errorMessage);
  } else {
    request.query = dto;
    return undefined;
  }
}
