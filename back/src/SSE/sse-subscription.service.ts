import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ReviewPayload } from './ReviewPayload';
import { SubscriptionService } from '../subscription/subscription.service';

export enum EventType {
  POST_UPDATED = 'update_post',
  NEW_COMMENT = 'new_comment',
  JOIN_REQUEST = 'join_request',
  JOIN_ACCEPT = 'join_accepted',
  RIDE_DELETE = 'ride_deleted',
  RIDE_START = 'ride_started',
  REVIEW_ADDED = 'review_added',
  // Add more event types as needed
}

export interface StreamEvent {
  type: EventType;
  targetId: number;
  recipientId: number;
  payload: any;
  timestamp: number;
}

@Injectable()
export class EventStreamService implements OnModuleInit {
  private readonly eventSubject = new Subject<StreamEvent>();
  private activeConnections = new Map<number, Set<number>>();
  private readonly logger = new Logger(EventStreamService.name);

  constructor(private readonly subscriptionService: SubscriptionService) {}

  onModuleInit() {
    this.logger.log('EventStreamService initialized');
  }

  emitEvent(event: Omit<StreamEvent, 'timestamp'>): void {
    const completeEvent: StreamEvent = {
      ...event,
      timestamp: Date.now(),
    };
    this.eventSubject.next(completeEvent);
    this.logger.log(`Event emitted: ${event.type} for user ${event.recipientId}`);
  }

  async emitEventToSubscribers(
    type: EventType,
    targetId: number,
    targetType: string,
    payload: any,
  ): Promise<void> {
    const subscribers = await this.subscriptionService.getSubscribers(
      targetId,
      targetType,
    );
    
    subscribers.forEach((subscriberId) => {
      this.emitEvent({
        type,
        targetId,
        recipientId: subscriberId,
        payload,
      });
    });
  }

  getStreamForRecipient(recipientId: number): Observable<StreamEvent> {
    return this.eventSubject.asObservable().pipe(
      filter((event) => event.recipientId === recipientId),
    );
  }

  registerConnection(recipientId: number, connectionId: number): void {
    if (!this.activeConnections.has(recipientId)) {
      this.activeConnections.set(recipientId, new Set());
    }
    const connections = this.activeConnections.get(recipientId);
    if (connections) {
      connections.add(connectionId);
      this.logger.log(
        `Connection registered: ${recipientId}:${connectionId}. Total connections: ${connections.size}`,
      );
    }
  }

  removeConnection(recipientId: number, connectionId: number): void {
    const connections = this.activeConnections.get(recipientId);
    if (connections) {
      connections.delete(connectionId);
      if (connections.size === 0) {
        this.activeConnections.delete(recipientId);
      }
      this.logger.log(
        `Connection removed: ${recipientId}:${connectionId}. Remaining connections: ${connections.size}`,
      );
    }
  }

  hasActiveConnections(recipientId: number): boolean {
    const connections = this.activeConnections.get(recipientId);
    return connections !== undefined && connections.size > 0;
  }

  getActiveRecipients(): number[] {
    return Array.from(this.activeConnections.keys());
  }

  getConnectionCount(recipientId: number): number {
    return this.activeConnections.get(recipientId)?.size || 0;
  }
}