import { FastifyReply } from 'fastify';
import { MessageHandler } from './MessageHandler';

export class SuccessResponse {
  constructor(
    public messageKey: string,
    public statusCode: number = 200
  ) {}

  send(reply: FastifyReply, lang: string) {
    const message =
      MessageHandler.getMessage(this.messageKey, lang) || this.messageKey;
    reply.code(this.statusCode).send({ error: false, message });
  }
}
