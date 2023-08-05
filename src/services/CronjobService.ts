import logger from '@/utils/logger';
import { CronJob } from 'cron';

export default class CronJobService {
  public static start() {
    logger.info('Cronjob iniciada');
    this.firstJob();
    this.secondJob();
  }

  private static firstJob() {
    new CronJob('0 */1 * * * *', async () => {
      logger.info('será executada a cada minuto');
    }).start();
  }

  private static secondJob() {
    new CronJob('0 */2 * * * *', () =>
      logger.info('será executada a cada 2 minutos')
    ).start();
  }
}
