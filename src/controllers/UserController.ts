import logger from '@/utils/logger';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { Controller, GET, Hook, PATCH } from 'fastify-decorators';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { instanceToPlain } from 'class-transformer';
import { sendResponse } from '@/utils/utils';
import { UpdatePasswordDto } from '@/dto/UpdatePasswordDto';
import { User } from '@/entities/User';
import { UserService } from '@/services/UserService';
import { validationMiddleware } from '@/middlewares/validationMiddleware';

@Controller('/user')
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

  @GET()
  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    logger.info('Buscar todos usuários');
    try {
      const users: User[] = await this.userService.getAll();
      const usersResponse = users.map(user => instanceToPlain(user));
      reply.send(usersResponse);
    } catch (error) {
      return sendResponse(reply, error);
    }
  }

  @GET('/details')
  async getDetails(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Buscar detalhes do usuário');
    const lang = request.headers['accept-language'] || 'en';
    const userId = request.user.id;
    try {
      const user = await this.userService.getById(userId);
      reply.send(instanceToPlain(user));
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @PATCH('/password')
  async updatePassword(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Atualizar senha do usuário');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await validationMiddleware(
      UpdatePasswordDto,
      request
    );
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const updatePasswordDto: UpdatePasswordDto =
      request.body as UpdatePasswordDto;
    const userId = request.user.id;
    try {
      const response = await this.userService.updatePassword(
        userId,
        updatePasswordDto
      );
      return response.send(reply, lang);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }
}
