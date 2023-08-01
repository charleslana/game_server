import logger from '@/utils/logger';
import UserRoleEnum from '@/enum/UserRoleEnum';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { Controller, GET, Hook } from 'fastify-decorators';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { instanceToPlain } from 'class-transformer';
import { sendResponse } from '@/utils/utils';
import { roleMiddleware } from '@/middlewares/roleMiddleware';
import { UserService } from '@/services/UserService';

@Controller('/admin')
export default class UserController {
  private userService = new UserService();

  @Hook('preHandler')
  async validateAuthenticate(request: FastifyRequest, reply: FastifyReply) {
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await authMiddleware(request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
  }

  @Hook('preHandler')
  async validateRole(request: FastifyRequest, reply: FastifyReply) {
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = roleMiddleware(request, [UserRoleEnum.Admin]);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
  }

  @GET('/user/:id')
  async getById(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    logger.info(`Buscar detalhes do usuário com id: ${id}`);
    const lang = request.headers['accept-language'] || 'en';
    try {
      const user = await this.userService.getById(id);
      reply.send(instanceToPlain(user));
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }
}
