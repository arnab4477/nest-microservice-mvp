import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'entities';
import { CONFIG, AppDataSource } from 'config';
import { AuthMiddleware, LoggerMiddleware } from 'middlewares';
import { AppController } from './app.controller';

import { BlockModule } from './block/block.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

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
    TypeOrmModule.forFeature([UserEntity]),
    BlockModule,
    UsersModule,
    RedisModule,
  ],

  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*').apply(AuthMiddleware).exclude('/').forRoutes('*');
  }
}
