
import { Module } from '@nestjs/common';
import { SseNotificationsController } from './sse-notifications.controller';
import { EventStreamService, SseSubscriptionService } from './sse-subscription.service';

@Module({
  controllers: [SseNotificationsController],
  providers: [EventStreamService, SseSubscriptionService],
  exports: [EventStreamService, SseSubscriptionService], 
})
export class EventStreamModule {}
