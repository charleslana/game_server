import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyRequest } from 'fastify';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export async function paramsValidationMiddleware<T extends object>(
  type: new () => T,
  request: FastifyRequest
): Promise<ErrorResponse | undefined> {
  if (!request.params) {
    return new ErrorResponse('Requisição sem parâmetros (params).');
  }
  const dto: T = plainToClass(type, request.params);
  const errors: ValidationError[] = await validate(dto);
  if (errors.length > 0) {
    const validationErrors = errors.map(error =>
      Object.values(error.constraints ?? {}).join(', ')
    );
    const errorMessage = validationErrors.join(', ');
    return new ErrorResponse(errorMessage);
  } else {
    request.params = dto;
    return undefined;
  }
}
