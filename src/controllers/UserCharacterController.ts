import logger from '@/utils/logger';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { bodyValidationMiddleware } from '@/middlewares/bodyValidationMiddleware';
import { Controller, DELETE, GET, Hook, PATCH, POST } from 'fastify-decorators';
import { CreateUserCharacterDto } from '@/dto/CreateUserCharacterDto';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { instanceToPlain } from 'class-transformer';
import { sendResponse } from '@/utils/utils';
import { UpdateUserCharacterNameDto } from '@/dto/UpdateUserCharacterNameDto';
import { User } from '@/entities/User';
import { UserCharacter } from '@/entities/UserCharacter';
import { UserCharacterService } from '@/services/UserCharacterService';

@Controller('/character')
export default class UserCharacterController {
  private userCharacterService = new UserCharacterService();

  @Hook('preHandler')
  async validateAuthenticate(request: FastifyRequest, reply: FastifyReply) {
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await authMiddleware(request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
  }

  @POST()
  async register(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Criar personagem');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await bodyValidationMiddleware(
      CreateUserCharacterDto,
      request
    );
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const createUserCharacterDto: CreateUserCharacterDto =
      request.body as CreateUserCharacterDto;
    const userId = request.user.id;
    try {
      const user: User = new User();
      user.id = userId;
      createUserCharacterDto.user = user;
      const response = await this.userCharacterService.create(
        createUserCharacterDto
      );
      return response.send(reply, lang);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @GET()
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Buscar todos personagens do usuário');
    const userId = request.user.id;
    try {
      const users: UserCharacter[] = await this.userCharacterService.getAll(
        userId
      );
      const usersResponse = users.map(user => instanceToPlain(user));
      reply.send(usersResponse);
    } catch (error) {
      return sendResponse(reply, error);
    }
  }

  @GET('/details')
  async getDetails(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Buscar detalhes do personagem do usuário');
    const lang = request.headers['accept-language'] || 'en';
    const userId = request.user.id;
    const characterId = request.session.userCharacterId || 0;
    try {
      const user = await this.userCharacterService.getByIdAndUserId(
        userId,
        characterId
      );
      reply.send(instanceToPlain(user));
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @GET('/profile/:id')
  async getProfile(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    logger.info(`Buscar detalhes do personagem do usuário com id: ${id}`);
    const lang = request.headers['accept-language'] || 'en';
    try {
      const user = await this.userCharacterService.getById(id);
      reply.send(instanceToPlain(user));
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @GET('/select/:id')
  async select(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    logger.info(`Selecionar personagem com id: ${id}`);
    const userId = request.user.id;
    const lang = request.headers['accept-language'] || 'en';
    try {
      await this.userCharacterService.getByIdAndUserId(userId, id);
      request.session.userCharacterId = id;
      reply.send();
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @GET('/logout')
  async logout(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Deslogar personagem');
    try {
      request.session.userCharacterId = undefined;
      reply.send();
    } catch (error) {
      return sendResponse(reply, error);
    }
  }

  @DELETE('/:id')
  async delete(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    logger.info('Deletar personagem');
    const lang = request.headers['accept-language'] || 'en';
    const userId = request.user.id;
    try {
      const response = await this.userCharacterService.inactivate(userId, id);
      return response.send(reply, lang);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @PATCH('/name')
  async updateName(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Atualizar nome do personagem');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await bodyValidationMiddleware(
      UpdateUserCharacterNameDto,
      request
    );
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const dto: UpdateUserCharacterNameDto =
      request.body as UpdateUserCharacterNameDto;
    const userId = request.user.id;
    const characterId = request.session.userCharacterId || 0;
    try {
      const response = await this.userCharacterService.updateName(
        userId,
        characterId,
        dto
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
