import { CONFIG } from 'config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: CONFIG.DB_URL,
  port: CONFIG.DB_PORT,
  username: CONFIG.DB_USERNAME,
  password: CONFIG.DB_PASSWORD,
  database: CONFIG.DB_NAME,
  name: CONFIG.DB_NAME,
  entities: ['dist/entities/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: false,
  migrationsTableName: 'migrations',
});

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to app database');
  })
  .catch((err) => {
    console.log(err);
  });

export { AppDataSource };
