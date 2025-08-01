import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService, QdrantService } from './service';
import {
  AIModule,
  DbModule,
  UserModule,
  AuthModule,
  QdrantModule,
} from './service';
import { LoggingMiddleware } from './service/logging.middleware';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    DbModule,
    UserModule,
    AIModule,
    QdrantModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
