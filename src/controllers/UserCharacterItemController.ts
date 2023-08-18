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
import { UserCharacterItemService } from '@/services/UserCharacterItemService';

@Controller('/user/character/item')
export default class UserCharacterItemController {
  private userCharacterItemService = new UserCharacterItemService();

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

  @GET()
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Buscar todos itens do personagem');
    const characterId = request.session.userCharacterId || 0;
    try {
      const findAll = await this.userCharacterItemService.getAll(characterId);
      const response = findAll.map(user => instanceToPlain(user));
      reply.send(response);
    } catch (error) {
      return sendResponse(reply, error);
    }
  }

  @GET('/:id')
  async getProfile(
    request: FastifyRequest<{ Params: IdDto }>,
    reply: FastifyReply
  ) {
    logger.info(
      `Buscar detalhes do item do personagem com id: ${request.params.id}`
    );
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await paramsValidationMiddleware(IdDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: IdDto = request.params;
    const characterId = request.session.userCharacterId || 0;
    try {
      const find = await this.userCharacterItemService.getByIdAndCharacterId(
        characterId,
        dto.id
      );
      reply.send(instanceToPlain(find));
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }
}
