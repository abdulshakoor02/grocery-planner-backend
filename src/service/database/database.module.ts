import { Module } from '@nestjs/common';
import { DbService } from './database.service';
import { LoggerService } from '../logger.service';

@Module({
  providers: [DbService, LoggerService],
  exports: [DbService],
})
export class DbModule {}
