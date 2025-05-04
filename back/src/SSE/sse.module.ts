import { Module } from '@nestjs/common';
import { EventStreamController } from './sse-notifications.controller';
import { EventStreamService } from './sse-subscription.service';

@Module({
  controllers: [EventStreamController],
  providers: [EventStreamService],
  exports: [EventStreamService],
})
export class EventStreamModule {}