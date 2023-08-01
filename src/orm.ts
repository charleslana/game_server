import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, '/entities/*{.ts,.js}')],
  synchronize: true,
  logging: true,
});

export default AppDataSource;
