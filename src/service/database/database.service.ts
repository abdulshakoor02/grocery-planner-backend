import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersModel } from 'src/models';

@Injectable()
export class DbService implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    // to do migrations for each table for more control
    await UsersModel.sync();

    return;
  }
}
