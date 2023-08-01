import app from '@/app';
import logger from './utils/logger';
import 'reflect-metadata';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const start = async () => {
  try {
    await app.listen({ port: PORT });
    logger.info(`Servidor rodando em http://localhost:${PORT}`);
  } catch (err) {
    logger.error('Erro ao iniciar o servidor:', err);
  }
};

start();
