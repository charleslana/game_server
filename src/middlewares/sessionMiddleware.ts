import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyRequest } from 'fastify';

export const sessionMiddleware = async (
  request: FastifyRequest
): Promise<ErrorResponse | undefined> => {
  try {
    const session = request.session.userCharacterId;
    if (!session) {
      return new ErrorResponse('session.unauthorized', 403);
    }
    return undefined;
  } catch (error) {
    if (error instanceof ErrorResponse) {
      return error;
    }
    throw error;
  }
};
