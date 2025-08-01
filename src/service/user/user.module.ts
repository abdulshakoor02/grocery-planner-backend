import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from '../../controllers/user.controller';
import { LoggerService } from '../logger.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, LoggerService],
  exports: [UserService],
})
export class UserModule {}
