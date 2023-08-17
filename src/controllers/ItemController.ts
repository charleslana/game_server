import logger from '@/utils/logger';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { Controller, GET, Hook } from 'fastify-decorators';
import { FastifyReply, FastifyRequest } from 'fastify';
import { instanceToPlain } from 'class-transformer';
import { ItemService } from '@/services/ItemService';
import { sendResponse } from '@/utils/utils';
import { sessionMiddleware } from '@/middlewares/sessionMiddleware';

@Controller('/item')
export default class ItemController {
  private itemService = new ItemService();

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
  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    logger.info('Buscar todos itens');
    try {
      const items = await this.itemService.getAll();
      const itemResponse = items.map(item => instanceToPlain(item));
      reply.send(itemResponse);
    } catch (error) {
      return sendResponse(reply, error);
    }
  }
}
