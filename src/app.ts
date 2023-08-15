import AppDataSource from '@/orm';
import cors from '@fastify/cors';
import CronJobService from './services/CronjobService';
import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifySession from '@fastify/session';
import logger from './utils/logger';
import { bootstrap } from 'fastify-decorators';
import { container } from '@/config/tsyringeConfig';
import { resolve } from 'path';

AppDataSource.initialize()
  .then(() => {
    logger.info('Conectado ao banco de dados');
  })
  .catch(error => {
    logger.error('Erro ao conectar ao banco de dados:', error);
  });

CronJobService.start();

const app = fastify();

app.register(fastifyCookie);

app.register(cors, {
  origin: true,
  credentials: true,
});

app.register(fastifySession, {
  secret: process.env.SESSION_SECRET as string,
  cookie: {
    secure: false,
  },
});

app.register(fastifyMultipart);

app.decorate('container', container);

app.register(bootstrap, {
  directory: resolve(__dirname, `controllers`),
  mask: /Controller\.[jt]s$/,
});

export default app;
