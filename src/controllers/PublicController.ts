import logger from '@/utils/logger';
import { AuthDto } from '@/dto/AuthDto';
import { Controller, POST } from 'fastify-decorators';
import { CreateUserDto } from '@/dto/CreateUserDto';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sendResponse } from '@/utils/utils';
import { UserService } from '@/services/UserService';
import { validationMiddleware } from '@/middlewares/validationMiddleware';

@Controller('/public')
export default class PublicController {
  private userService = new UserService();

  @POST('/user/register')
  async register(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Cadastrar usuário');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await validationMiddleware(CreateUserDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const createUserDto: CreateUserDto = request.body as CreateUserDto;
    try {
      const response = await this.userService.create(createUserDto);
      return response.send(reply, lang);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }

  @POST('/user/login')
  async login(request: FastifyRequest, reply: FastifyReply) {
    logger.info('Realizando login');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await validationMiddleware(AuthDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const authDto: AuthDto = request.body as AuthDto;
    try {
      const token = await this.userService.authenticateAndGenerateToken(
        authDto
      );
      reply.send({ token });
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }
}
