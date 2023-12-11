import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
dotenv.config();

const source = new DataSource({
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: 54320,
  entities: ['src/**/*.entity.ts'],
  migrationsTableName: 'migrations',
  migrations: ['./migrations/*.ts'],
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  namingStrategy: new SnakeNamingStrategy(),
});

export default source;
