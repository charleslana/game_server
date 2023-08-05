import fs from 'fs';
import logger from '@/utils/logger';
import mimeTypes from 'mime-types';
import { AuthDto } from '@/dto/AuthDto';
import { bodyValidationMiddleware } from '@/middlewares/bodyValidationMiddleware';
import { Controller, GET, POST } from 'fastify-decorators';
import { CreateUserDto } from '@/dto/CreateUserDto';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sendResponse } from '@/utils/utils';
import { UploadService } from '@/services/UploadService';
import { UserService } from '@/services/UserService';

@Controller('/public')
export default class PublicController {
  private userService = new UserService();
  private uploadService = new UploadService();

  @POST('/user/register')
  async register(
    request: FastifyRequest<{ Body: CreateUserDto }>,
    reply: FastifyReply
  ) {
    logger.info('Cadastrar usuário');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await bodyValidationMiddleware(
      CreateUserDto,
      request
    );
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const createUserDto: CreateUserDto = request.body;
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
  async login(request: FastifyRequest<{ Body: AuthDto }>, reply: FastifyReply) {
    logger.info('Realizando login');
    const lang = request.headers['accept-language'] || 'en';
    const errorResponse = await bodyValidationMiddleware(AuthDto, request);
    if (errorResponse) {
      return errorResponse.send(reply, lang);
    }
    const authDto: AuthDto = request.body;
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

  @GET('/upload/character/:fileName')
  async getUploadImage(
    request: FastifyRequest<{ Params: { fileName: string } }>,
    reply: FastifyReply
  ) {
    logger.info('Buscar imagem do personagem');
    const lang = request.headers['accept-language'] || 'en';
    try {
      const { fileName } = request.params;
      const filePath = await this.uploadService.getFile(fileName);
      const mimeType = mimeTypes.lookup(fileName);
      if (mimeType) {
        reply.header('Content-Type', mimeType);
      }
      const readStream = fs.createReadStream(filePath);
      return reply.send(readStream);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        return error.send(reply, lang);
      }
      return sendResponse(reply, error);
    }
  }
}
