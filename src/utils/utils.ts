import { faker } from '@faker-js/faker';
import { FastifyReply } from 'fastify';

export function sendResponse(reply: FastifyReply, message?: unknown) {
  reply.code(409).send(message);
}

export function generateRandomString(quantity = 20): string {
  return faker.string.alpha(quantity);
}

export const formatDate = (date: Date): string => {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
