// sse-subscription.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';

export enum EventType {
  POST_UPDATED = 'POST_UPDATED',
  NEW_COMMENT = 'NEW_COMMENT',
  JOIN_REQUEST = 'JOIN_REQUEST',
  JOIN_ACCEPT = 'JOIN_ACCEPT',
  RIDE_DELETE = 'RIDE_DELETE',
  RIDE_START = 'RIDE_START',
  REVIEW_ADDED = 'REVIEW_ADDED',
}

interface EventData {
  type: EventType;
  targetId: number;
  recipientId?: number;
  payload: any;
}

interface SSEConnection {
  userId: number;
  response: Response;
  lastActivity: Date;
}

@Injectable()
export class SseSubscriptionService {
  private readonly logger = new Logger(SseSubscriptionService.name);
  private connections = new Map<number, SSEConnection>();

  /**
   * Subscribe a user to SSE events
   */
  subscribe(userId: number, response: Response): () => void {
    const connection: SSEConnection = {
      userId,
      response,
      lastActivity: new Date(),
    };

    this.connections.set(userId, connection);
    this.logger.log(`User ${userId} subscribed to SSE events`);

    // Return unsubscribe function
    return () => {
      this.connections.delete(userId);
      this.logger.log(`User ${userId} unsubscribed from SSE events`);
    };
  }

  /**
   * Send event to a specific user
   */
  async sendEventToUser(userId: number, eventData: EventData): Promise<boolean> {
    const connection = this.connections.get(userId);
    
    if (!connection) {
      this.logger.debug(`No active connection for user ${userId}`);
      return false;
    }

    try {
      const { response } = connection;
      
      if (response.writableEnded) {
        this.connections.delete(userId);
        return false;
      }

      const eventPayload = {
        ...eventData.payload,
        type: eventData.type,
        timestamp: new Date().toISOString(),
      };

      response.write(`data: ${JSON.stringify(eventPayload)}\n\n`);
      connection.lastActivity = new Date();
      
      this.logger.debug(`Event sent to user ${userId}: ${eventData.type}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send event to user ${userId}:`, error);
      this.connections.delete(userId);
      return false;
    }
  }

  /**
   * Send event to multiple users
   */
  async sendEventToUsers(userIds: number[], eventData: EventData): Promise<void> {
    const promises = userIds.map(userId => 
      this.sendEventToUser(userId, eventData)
    );
    
    await Promise.all(promises);
  }

  /**
   * Get all active connections
   */
  getActiveConnections(): number[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Clean up stale connections
   */
  cleanupStaleConnections(): void {
    const now = new Date();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes

    for (const [userId, connection] of this.connections.entries()) {
      const timeSinceLastActivity = now.getTime() - connection.lastActivity.getTime();
      
      if (timeSinceLastActivity > staleThreshold || connection.response.writableEnded) {
        this.connections.delete(userId);
        this.logger.log(`Cleaned up stale connection for user ${userId}`);
      }
    }
  }
}

@Injectable()
export class EventStreamService {
  private readonly logger = new Logger(EventStreamService.name);

  constructor(
    private readonly sseSubscriptionService: SseSubscriptionService,
  ) {
    // Clean up stale connections every 5 minutes
    setInterval(() => {
      this.sseSubscriptionService.cleanupStaleConnections();
    }, 5 * 60 * 1000);
  }

  /**
   * Emit event to a specific user
   */
  async emitEvent(eventData: EventData): Promise<void> {
    if (eventData.recipientId) {
      await this.sseSubscriptionService.sendEventToUser(
        eventData.recipientId,
        eventData
      );
    }
  }

  /**
   * Emit event to subscribers of a target (e.g., post subscribers)
   * This would typically query your database to find subscribers
   */
  async emitEventToSubscribers(
    type: EventType,
    targetId: number,
    targetType: string,
    payload: any,
  ): Promise<void> {
    // TODO: Implement logic to get subscribers from database
    // For now, this is a placeholder
    const subscribers = await this.getSubscribers(targetId, targetType);
    
    const eventData: EventData = {
      type,
      targetId,
      payload,
    };

    await this.sseSubscriptionService.sendEventToUsers(subscribers, eventData);
  }

  /**
   * Get subscribers for a target - implement based on your database schema
   */
  private async getSubscribers(targetId: number, targetType: string): Promise<number[]> {
    // TODO: Implement based on your subscription/follow system
    // This should query your database to find users who should receive notifications
    // for the given target (e.g., users who follow a post, group members, etc.)
    
    // Example implementation:
    // if (targetType === 'post') {
    //   return await this.subscriptionService.getPostSubscribers(targetId);
    // }
    // if (targetType === 'group') {
    //   return await this.subscriptionService.getGroupMembers(targetId);
    // }
    
    return []; // Return empty array for now
  }
}