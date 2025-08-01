import { Module } from '@nestjs/common';
import { QdrantService } from './qdrant.service';
import { LoggerService } from '../logger.service';

@Module({
  providers: [QdrantService, LoggerService],
  exports: [QdrantService],
})
export class QdrantModule {}
