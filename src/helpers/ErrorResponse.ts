import { FastifyReply } from 'fastify';
import { MessageHandler } from './MessageHandler';

export class ErrorResponse {
  constructor(
    public messageKey: string,
    public statusCode: number = 400
  ) {}
  send(reply: FastifyReply, lang: string) {
    const message =
      MessageHandler.getMessage(this.messageKey, lang) || this.messageKey;
    reply.code(this.statusCode).send({ error: true, message });
  }
}
