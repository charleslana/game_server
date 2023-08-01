import { faker } from '@faker-js/faker';
import { FastifyReply } from 'fastify';

export function sendResponse(reply: FastifyReply, message?: unknown) {
  reply.code(409).send(message);
}

export function generateRandomString(quantity = 20): string {
  return faker.string.alpha(quantity);
}
