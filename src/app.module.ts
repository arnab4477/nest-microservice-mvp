import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CONFIG } from 'config';
import { LoggerMiddleware } from 'middlewares';
import { AppController } from './app.controller';
import AppDataSource from 'config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'postgres',
          host: CONFIG.DB_URL,
          port: CONFIG.DB_PORT,
          username: CONFIG.DB_USERNAME,
          password: CONFIG.DB_PASSWORD,
          database: CONFIG.DB_NAME,
          name: CONFIG.DB_NAME,
          entities: ['dist/entities/*.entity{.ts,.js}'],
          logging: false,
          synchronize: false,
          migrationsRun: false,
          connectTimeoutMS: 20000,
          autoLoadEntities: true,
          poolSize: 25,
        };
      },

      dataSourceFactory: async () => {
        return AppDataSource;
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('DB Config:', {
      host: CONFIG.DB_URL,
      port: CONFIG.DB_PORT,
      username: CONFIG.DB_USERNAME,
      password: CONFIG.DB_PASSWORD,
      database: CONFIG.DB_NAME,
    });

    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
