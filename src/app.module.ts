import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TicketsModule } from './tickets/tickets.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';
import { UserRepository } from './database/repositorise/user.repository.js';
import { UserController } from './users/users.controller.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TicketsModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
  ],
  providers: [UserRepository],
  exports: [UserRepository],
  controllers: [UserController],
})
export class AppModule {}
