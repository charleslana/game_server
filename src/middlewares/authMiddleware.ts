import { AuthService } from '@/services/AuthService';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyRequest } from 'fastify';

export const authMiddleware = async (
  request: FastifyRequest
): Promise<ErrorResponse | undefined> => {
  try {
    const token = request.headers.authorization;
    if (!token) {
      return new ErrorResponse('user.unauthorized', 403);
    }
    const authService = new AuthService();
    const decodedToken = authService.verifyJwtToken(token!);
    request.user = decodedToken['user'];
    return undefined;
  } catch (error) {
    if (error instanceof ErrorResponse) {
      return error;
    }
    throw error;
  }
};
