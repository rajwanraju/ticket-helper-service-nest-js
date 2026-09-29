import { Module } from '@nestjs/common';
import { UserService } from './users.service.js';
import { UserController } from './users.controller.js';
import { UserRepository } from '../database/repositorise/user.repository.js';

@Module({
  providers: [UserService, UserRepository],
  exports: [UserService],
  controllers: [UserController]
})
export class UsersModule {}
