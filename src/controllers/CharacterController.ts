import logger from '@/utils/logger';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { CharacterService } from '@/services/CharacterService';
import { Controller, GET, Hook } from 'fastify-decorators';
import { FastifyReply, FastifyRequest } from 'fastify';
import { instanceToPlain } from 'class-transformer';
import { sendResponse } from '@/utils/utils';

@Controller('/character')
export default class CharacterController {
  private characterService = new CharacterService();

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
    logger.info('Buscar todos personagens');
    try {
      const characters = await this.characterService.getAll();
      const usersResponse = characters.map(character =>
        instanceToPlain(character)
      );
      reply.send(usersResponse);
    } catch (error) {
      return sendResponse(reply, error);
    }
  }
}
