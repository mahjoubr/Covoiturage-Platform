// notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { EventStreamService, EventType } from '../SSE/sse-subscription.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly eventStreamService: EventStreamService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async sendNotificationToUser(
    recipientId: number,
    type: EventType,
    targetId: number,
    payload: any,
  ): Promise<void> {
    this.eventStreamService.emitEvent({
      type,
      targetId,
      recipientId,
      payload,
    });
  }

  async sendNotificationToSubscribers(
    type: EventType,
    targetId: number,
    targetType: string,
    payload: any,
  ): Promise<void> {
    await this.eventStreamService.emitEventToSubscribers(
      type,
      targetId,
      targetType,
      payload,
    );
  }

  async notifyPostUpdated(postId: number, updaterId: number): Promise<void> {
    const payload = {
      message: 'A post you follow has been updated',
      postId,
      updaterId,
    };
    await this.sendNotificationToSubscribers(
      EventType.POST_UPDATED,
      postId,
      'post',
      payload,
    );
  }

  async notifyNewComment(
    postId: number,
    commentId: number,
    commenterId: number,
  ): Promise<void> {
    const payload = {
      message: 'New comment on a post you follow',
      postId,
      commentId,
      commenterId,
    };
    await this.sendNotificationToSubscribers(
      EventType.NEW_COMMENT,
      postId,
      'post',
      payload,
    );
  }

  // Add more specific notification methods as needed
}