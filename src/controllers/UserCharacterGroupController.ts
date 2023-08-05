import logger from '@/utils/logger';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { Controller, GET, Hook } from 'fastify-decorators';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IdDto } from '@/dto/IdDto';
import { instanceToPlain } from 'class-transformer';
import { paramsValidationMiddleware } from '@/middlewares/paramsValidationMiddleware';
import { sendResponse } from '@/utils/utils';
import { sessionMiddleware } from '@/middlewares/sessionMiddleware';
import { UserCharacterGroupService } from '@/services/UserCharacterGroupService';

@Controller('/group/character')
export default class UserCharacterController {
  private userCharacterGroupService = new UserCharacterGroupService();

  @Hook('preHandler')
  async validateAuthenticate(request: FastifyRequest, reply: FastifyReply) {
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await authMiddleware(request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
  }

  @Hook('preHandler')
  async validateSession(request: FastifyRequest, reply: FastifyReply) {
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await sessionMiddleware(request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
  }

  @GET('/:id')
  async getAll(
    request: FastifyRequest<{ Params: IdDto }>,
    reply: FastifyReply
  ) {
    logger.info(`Buscar personagens do grupo: ${request.params.id}`);
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await paramsValidationMiddleware(IdDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: IdDto = request.params;
    try {
      const groupCharacters = await this.userCharacterGroupService.getAll(
        dto.id,
        true
      );
      reply.send(instanceToPlain(groupCharacters));
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }
}
