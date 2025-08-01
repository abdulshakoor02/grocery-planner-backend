import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoggerService } from '../logger.service';
import { env } from '../../env';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  async register(
    name: string,
    email: string,
    mobile: string,
    password: string,
  ): Promise<{ user: any; access_token: string }> {
    const startTime = Date.now();
    try {
      // Create user through UserService
      const user = await this.userService.createUser(
        name,
        email,
        mobile,
        password,
      );

      // Generate JWT token
      const payload = { sub: user.id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      const duration = Date.now() - startTime;
      this.logger.info('User registration successful', {
        email,
        userId: user.id,
        duration: `${duration}ms`,
      });

      return {
        user,
        access_token,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('User registration failed', {
        email,
        error: error.message,
        duration: `${duration}ms`,
      });
      throw new Error(error.message);
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: any; access_token: string }> {
    const startTime = Date.now();
    try {
      // Find and validate user through UserService
      const user = await this.userService.findUserByEmailAndPassword(
        email,
        password,
      );

      if (!user) {
        const duration = Date.now() - startTime;
        this.logger.warn('Login failed - Invalid credentials', {
          email,
          duration: `${duration}ms`,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const payload = { sub: user.id, email: user.email };
      // LOGGING: Check the secret used for SIGNING
      console.log(
        'AUTH SERVICE SIGNING WITH SECRET:',
        process.env.JWT_SECRET || 'your-secret-key',
      );
      const access_token = this.jwtService.sign(payload);
      console.log('Generated token with payload:', payload);
      console.log('Generated token:', access_token);

      const duration = Date.now() - startTime;
      this.logger.info('User login successful', {
        email,
        userId: user.id,
        duration: `${duration}ms`,
      });

      return {
        user,
        access_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      const duration = Date.now() - startTime;
      this.logger.error('User login failed', {
        email,
        error: error.message,
        duration: `${duration}ms`,
      });
      throw error;
    }
  }

  async validateUser(
    token: string,
  ): Promise<{ user: any; access_token: string } | { error: string }> {
    const startTime = Date.now();
    try {
      // Verify the JWT token
      const payload = this.jwtService.verify(token, { secret: env.jwt.secret });

      // Find user by ID from the payload
      const user = await this.userService.findUserByEmail(payload.email);

      if (!user) {
        const duration = Date.now() - startTime;
        this.logger.warn('Token validation failed - User not found', {
          email: payload.email,
          duration: `${duration}ms`,
        });
        return { error: 'User not found' };
      }

      // Return the same structure as login
      const userData = user.toJSON();
      delete userData.password;

      const duration = Date.now() - startTime;
      this.logger.info('Token validation successful', {
        email: payload.email,
        userId: user.id,
        duration: `${duration}ms`,
      });

      return {
        user: userData,
        access_token: token, // Return the same token that was validated
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.warn('Token validation failed', {
        error: error.message,
        duration: `${duration}ms`,
      });
      return { error: 'Invalid token' };
    }
  }
}
