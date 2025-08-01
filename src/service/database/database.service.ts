import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { UsersModel } from '../../models';
import { LoggerService } from '../logger.service';

@Injectable()
export class DbService implements OnModuleInit {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  async onModuleInit(): Promise<void> {
    try {
      // Test database connection
      await this.testConnection();

      // Sync models
      await UsersModel.sync();

      this.logger.info('Database connection established and models synced');
    } catch (error) {
      this.logger.error('Database initialization failed', {
        error: error.message,
      });
      throw error;
    }
  }

  private async testConnection(): Promise<void> {
    const startTime = Date.now();
    try {
      await UsersModel.sequelize.authenticate();
      const duration = Date.now() - startTime;
      this.logger.info('Database connection successful', {
        duration: `${duration}ms`,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Database connection failed', {
        error: error.message,
        duration: `${duration}ms`,
      });
      throw error;
    }
  }
}
