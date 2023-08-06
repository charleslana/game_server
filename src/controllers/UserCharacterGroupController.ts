import logger from '@/utils/logger';
import { ActiveDto } from '@/dto/ActiveDto';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { container } from 'tsyringe';
import { Controller, GET, Hook, POST } from 'fastify-decorators';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Group } from '@/entities/Group';
import { IdDto } from '@/dto/IdDto';
import { instanceToPlain } from 'class-transformer';
import { paramsValidationMiddleware } from '@/middlewares/paramsValidationMiddleware';
import { queryValidationMiddleware } from '@/middlewares/queryValidationMiddleware';
import { sendResponse } from '@/utils/utils';
import { sessionMiddleware } from '@/middlewares/sessionMiddleware';
import { UserCharacter } from '@/entities/UserCharacter';
import { UserCharacterGroup } from '@/entities/UserCharacterGroup';
import { UserCharacterGroupService } from '@/services/UserCharacterGroupService';

@Controller('/group/character')
export default class UserCharacterController {
  private userCharacterGroupService = container.resolve(
    UserCharacterGroupService
  );

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
    request: FastifyRequest<{ Params: IdDto; Querystring: ActiveDto }>,
    reply: FastifyReply
  ) {
    logger.info(`Buscar personagens do grupo: ${request.params.id}`);
    const lang = request.headers['accept-language'] || 'en';
    let errorResponse = await paramsValidationMiddleware(IdDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    errorResponse = await queryValidationMiddleware(ActiveDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: IdDto = request.params;
    try {
      const groupCharacters = await this.userCharacterGroupService.getAll(
        dto.id,
        request.query.active
      );
      reply.send(instanceToPlain(groupCharacters));
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @POST('/invite/:id')
  async create(
    request: FastifyRequest<{ Params: IdDto }>,
    reply: FastifyReply
  ) {
    logger.info('Solicitar convite de grupo');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await paramsValidationMiddleware(IdDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: IdDto = request.params;
    const characterId = request.session.userCharacterId || 0;
    const userCharacterGroup = new UserCharacterGroup();
    const userCharacter = new UserCharacter();
    const group = new Group();
    group.id = dto.id;
    userCharacter.id = characterId;
    userCharacterGroup.userCharacter = userCharacter;
    userCharacterGroup.userCharacterGroup = group;
    try {
      const response = await this.userCharacterGroupService.create(
        userCharacterGroup
      );
      return response.send(reply, lang);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @POST('/invite/status/:id')
  async invite(
    request: FastifyRequest<{ Params: IdDto; Querystring: ActiveDto }>,
    reply: FastifyReply
  ) {
    logger.info('Solicitar convite de grupo');
    const lang = request.headers['accept-language'] || 'en';
    let errorResponse = await paramsValidationMiddleware(IdDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    errorResponse = await queryValidationMiddleware(ActiveDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: IdDto = request.params;
    const characterId = request.session.userCharacterId || 0;
    try {
      const response = await this.userCharacterGroupService.invite(
        dto.id,
        characterId,
        request.query.active
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
