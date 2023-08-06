import logger from '@/utils/logger';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { bodyValidationMiddleware } from '@/middlewares/bodyValidationMiddleware';
import { container } from 'tsyringe';
import { Controller, GET, Hook, POST } from 'fastify-decorators';
import { CreateGroupDto } from '@/dto/CreateGroupDto';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { GroupService } from '@/services/GroupService';
import { instanceToPlain } from 'class-transformer';
import { PageDto } from '@/dto/PageDto';
import { paramsValidationMiddleware } from '@/middlewares/paramsValidationMiddleware';
import { SearchGroupDto } from '@/dto/SearchGroupDto';
import { sendResponse } from '@/utils/utils';
import { sessionMiddleware } from '@/middlewares/sessionMiddleware';
import { UserCharacter } from '@/entities/UserCharacter';

@Controller('/group')
export default class GroupController {
  private groupService = container.resolve(GroupService);

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

  @POST()
  async create(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Criar grupo');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await bodyValidationMiddleware(
      CreateGroupDto,
      request
    );
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: CreateGroupDto = request.body as CreateGroupDto;
    const characterId = request.session.userCharacterId || 0;
    try {
      const userCharacter: UserCharacter = new UserCharacter();
      userCharacter.id = characterId;
      dto.userCharacter = userCharacter;
      const response = await this.groupService.create(dto);
      return response.send(reply, lang);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @GET('/page/:page')
  async getPaginated(
    request: FastifyRequest<{ Params: PageDto }>,
    reply: FastifyReply
  ) {
    logger.info(`Buscar grupo paginado pela pagina: ${request.params.page}`);
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await paramsValidationMiddleware(PageDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: PageDto = request.params;
    try {
      const groups = await this.groupService.findPaginated(dto);
      reply.send(instanceToPlain(groups));
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @POST('/search')
  async search(
    request: FastifyRequest<{ Body: SearchGroupDto }>,
    reply: FastifyReply
  ) {
    logger.info('Pesquisar grupo');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await bodyValidationMiddleware(
      SearchGroupDto,
      request
    );
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: SearchGroupDto = request.body;
    try {
      const groups = await this.groupService.search(dto);
      reply.send(instanceToPlain(groups));
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }
}
