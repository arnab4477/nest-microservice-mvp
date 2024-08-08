import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerMiddleware } from 'middlewares';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
