import AppDataSource from '@/orm';
import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import logger from './utils/logger';
import { bootstrap } from 'fastify-decorators';
import { resolve } from 'path';

AppDataSource.initialize()
  .then(() => {
    logger.info('Conectado ao banco de dados');
  })
  .catch(error => {
    logger.error('Erro ao conectar ao banco de dados:', error);
  });

const app = fastify();

app.register(bootstrap, {
  directory: resolve(__dirname, `controllers`),
  mask: /Controller\.[jt]s$/,
});

app.register(fastifyCookie);

app.register(fastifySession, {
  secret: process.env.SESSION_SECRET as string,
  cookie: {
    secure: false,
  },
});

export default app;
