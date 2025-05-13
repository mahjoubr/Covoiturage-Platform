import { Injectable, OnModuleInit } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ReviewPayload } from './ReviewPayload';

export enum EventType{
  POST_UPDATED='update_post',
  NEW_COMMENT= 'new_comment',
  JOIN_REQUEST= 'join_request',
  JOIN_ACCEPT= 'join_accepted',
  RIDE_DELETE='ride_deleted',
  RIDE_START='ride_started',
  REVIEW_ADDED='review_added',
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

  onModuleInit() {
    console.log('EventStreamService initialized');
  }

  emitEvent(event: Omit<StreamEvent, 'timestamp'>): void {
    const completeEvent: StreamEvent = {
      ...event,
      timestamp: Date.now()
    };
    this.eventSubject.next(completeEvent);
  }

  getStreamForRecipient(recipientId: number): Observable<StreamEvent> {
    return this.eventSubject.asObservable().pipe(
      filter(event => event.recipientId === recipientId)
    );
  }

  registerConnection(recipientId: number, connectionId: number): void {
    if (!this.activeConnections.has(recipientId)) {
      this.activeConnections.set(recipientId, new Set());
    }
    const connections = this.activeConnections.get(recipientId);
    if (connections) {
      connections.add(connectionId);
    }
    console.log(`Connection registered: ${recipientId}:${connectionId}`);
  }

  removeConnection(recipientId: number, connectionId: number): void {
    const connections = this.activeConnections.get(recipientId);
    if (connections) {
      connections.delete(connectionId);
      if (connections.size === 0) {
        this.activeConnections.delete(recipientId);
      }
      console.log(`Connection removed: ${recipientId}:${connectionId}`);
    }
  }

  hasActiveConnections(recipientId: number): boolean {
    const connections = this.activeConnections.get(recipientId);
    return connections !== undefined && connections.size > 0;
  }

  getActiveRecipients(): number[] {
    return Array.from(this.activeConnections.keys());
  }


  emitReviewEvent(
    targetId: number,
    payload: ReviewPayload
  ): void {
    this.emitEvent({
      type: EventType.REVIEW_ADDED,
      targetId,
      recipientId: targetId,  // Recipient is the user being reviewed
      payload
    });
  }
  
  
}
