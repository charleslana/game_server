import UserRoleEnum from '@/enum/UserRoleEnum';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyRequest } from 'fastify';

export const roleMiddleware = (
  request: FastifyRequest,
  allowedRoles: UserRoleEnum[]
): ErrorResponse | undefined => {
  try {
    const userRoles = request.user.roles;
    const hasPermission = userRoles.some(role =>
      allowedRoles.includes(role.role)
    );
    if (!hasPermission) {
      return new ErrorResponse('user.unauthorized', 403);
    } else {
      return undefined;
    }
  } catch (error) {
    if (error instanceof ErrorResponse) {
      return error;
    }
    throw error;
  }
};
