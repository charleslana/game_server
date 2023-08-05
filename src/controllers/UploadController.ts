import logger from '@/utils/logger';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { Controller, Hook, PATCH } from 'fastify-decorators';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sendResponse } from '@/utils/utils';
import { sessionMiddleware } from '@/middlewares/sessionMiddleware';
import { UploadService } from '@/services/UploadService';

@Controller('/upload')
export default class UploadController {
  private uploadService = new UploadService();

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

  @PATCH('/character')
  async sendUploadImage(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Enviar imagem do personagem');
    const lang = request.headers['accept-language'] || 'en';
    const userId = request.user.id;
    const characterId = request.session.userCharacterId || 0;
    try {
      const fileName = await this.uploadService.send(
        request,
        userId,
        characterId
      );
      return reply.send({ fileName });
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }
}
