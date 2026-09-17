import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TicketsModule } from './tickets/tickets.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TicketsModule,
  ]
})
export class AppModule {}
