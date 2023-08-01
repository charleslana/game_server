import IAuth from '@/interfaces/IAuth';

declare module 'fastify' {
  interface FastifyRequest {
    user: IAuth['user'];
  }
}
