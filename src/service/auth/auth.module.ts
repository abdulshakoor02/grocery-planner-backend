import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from '../../controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { LoggerService } from '../logger.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '3650d' }, // 10 years - effectively never expiring
    }),
  ],
  providers: [AuthService, JwtStrategy, UserService, LoggerService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
