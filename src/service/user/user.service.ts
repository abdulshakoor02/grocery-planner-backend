import { Injectable, Inject } from '@nestjs/common';
import { UsersModel } from '../../models';
import { IUsersModel } from '../../models/interfaces/users';
import * as bcrypt from 'bcrypt';
import { LoggerService } from '../logger.service';
import * as messageRepo from '../../repository/messagesRepo/messageHandlers';
import * as userRepo from '../../repository/userRepo/users';

@Injectable()
export class UserService {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  async createUser(
    name: string,
    email: string,
    mobile: string,
    password: string,
  ): Promise<Partial<IUsersModel>> {
    const startTime = Date.now();
    try {
      // Check if user already exists
      const existingUser = await UsersModel.findOne({
        where: { email },
      });

      if (existingUser) {
        const duration = Date.now() - startTime;
        this.logger.warn('User creation failed - Email already exists', {
          email,
          duration: `${duration}ms`,
        });
        throw new Error('User with this email already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await UsersModel.create({
        name,
        email,
        mobile,
        password: hashedPassword,
      });

      // Return user without password
      const userData = user.toJSON();
      delete userData.password;

      const duration = Date.now() - startTime;
      this.logger.info('User created successfully', {
        email,
        userId: user.id,
        duration: `${duration}ms`,
      });

      return userData;
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        throw error;
      }

      const duration = Date.now() - startTime;
      this.logger.error('User creation failed', {
        email,
        error: error.message,
        duration: `${duration}ms`,
      });
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<IUsersModel | null> {
    const startTime = Date.now();
    try {
      const user = await UsersModel.findOne({
        where: { email },
      });

      const duration = Date.now() - startTime;
      if (user) {
        this.logger.debug('User found by email', {
          email,
          userId: user.id,
          duration: `${duration}ms`,
        });
      } else {
        this.logger.debug('User not found by email', {
          email,
          duration: `${duration}ms`,
        });
      }

      return user;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Error finding user by email', {
        email,
        error: error.message,
        duration: `${duration}ms`,
      });
      throw error;
    }
  }

  async findUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<Partial<IUsersModel> | null> {
    const startTime = Date.now();
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        const duration = Date.now() - startTime;
        this.logger.debug('User not found for authentication', {
          email,
          duration: `${duration}ms`,
        });
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      const duration = Date.now() - startTime;
      if (!isPasswordValid) {
        this.logger.warn('Invalid password for user', {
          email,
          duration: `${duration}ms`,
        });
        return null;
      }

      // Return user without password
      const userData = user.toJSON();
      delete userData.password;

      this.logger.debug('User authenticated successfully', {
        email,
        userId: user.id,
        duration: `${duration}ms`,
      });

      return userData;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Error authenticating user', {
        email,
        error: error.message,
        duration: `${duration}ms`,
      });
      throw error;
    }
  }
  public createNewChat = messageRepo.createNewChat;
  public additionalChat = messageRepo.additionalChat;
  public chatCount = messageRepo.chatCount;
  public chatContext = messageRepo.chatContext;
  public chatForToday = messageRepo.chatForToday;
  public chatForMonth = messageRepo.chatForMonth;
  public getUser = userRepo.getUser;
}
