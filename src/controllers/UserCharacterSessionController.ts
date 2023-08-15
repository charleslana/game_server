import logger from '@/utils/logger';
import { AttributeDto } from '@/dto/AttributeDto';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { bodyValidationMiddleware } from '@/middlewares/bodyValidationMiddleware';
import { Controller, Hook, PATCH } from 'fastify-decorators';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sendResponse } from '@/utils/utils';
import { sessionMiddleware } from '@/middlewares/sessionMiddleware';
import { UserCharacterService } from '@/services/UserCharacterService';

@Controller('/user/character')
export default class UserCharacterSessionController {
  private userCharacterService = new UserCharacterService();

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

  @PATCH('/attribute')
  async sendUploadImage(
    request: FastifyRequest<{ Body: AttributeDto }>,
    reply: FastifyReply
  ) {
    logger.info('Distribuir pontos do personagem');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await bodyValidationMiddleware(AttributeDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: AttributeDto = request.body;
    const userId = request.user.id;
    const characterId = request.session.userCharacterId || 0;
    dto.characterId = characterId;
    dto.userId = userId;
    try {
      const response = await this.userCharacterService.distributePoints(dto);
      return response.send(reply, lang);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }
}
