import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { QdrantModule } from '../qdrant/qdrant.module';
import { AIController } from '../../controllers';
import { LoggerService } from '../logger.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { EmbeddingService } from '../embeddings';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [QdrantModule],
  controllers: [AIController],
  providers: [
    AIService,
    LoggerService,
    EmbeddingService,
    AuthGuard,
    JwtService,
    AuthService,
    UserService,
  ],
  exports: [AIService],
})
export class AIModule {}
