import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyRequest } from 'fastify';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export async function bodyValidationMiddleware<T extends object>(
  type: new () => T,
  request: FastifyRequest
): Promise<ErrorResponse | undefined> {
  if (!request.body) {
    return new ErrorResponse('Requisição sem corpo (body).');
  }
  if (typeof request.body !== 'object' || Array.isArray(request.body)) {
    return new ErrorResponse(
      'Requisição inválida. O corpo deve ser um objeto JSON.'
    );
  }
  const dto: T = plainToClass(type, request.body);
  const errors: ValidationError[] = await validate(dto);
  if (errors.length > 0) {
    const validationErrors = errors.map(error =>
      Object.values(error.constraints ?? {}).join(', ')
    );
    const errorMessage = validationErrors.join(', ');
    return new ErrorResponse(errorMessage);
  } else {
    request.body = dto;
    return undefined;
  }
}
