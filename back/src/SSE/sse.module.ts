import { Module } from '@nestjs/common';
import { SseNotificationsController } from './sse-notifications.controller';
import { EventStreamService } from './sse-subscription.service';

@Module({
  controllers: [SseNotificationsController],
  providers: [EventStreamService],
  exports: [EventStreamService],
})
export class EventStreamModule {}