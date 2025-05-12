
import {
  Controller,
  Sse,
  Param,
  Req,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventStreamService, StreamEvent } from './sse-subscription.service';
import { AuthGuard } from '@nestjs/passport';

interface SseMessageEvent {
  data: string | object;
  id?: number;
  type?: string;
  retry?: number;
}

@Controller('events')
export class EventStreamController {
  private readonly logger = new Logger(EventStreamController.name);

  constructor(private readonly eventStreamService: EventStreamService) {}

  @Sse('stream/:recipientId')
  @UseGuards(AuthGuard('jwt')) // Add authentication if needed
  subscribeToEvents(
    @Param('recipientId') recipientId: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Observable<SseMessageEvent> {
    // Generate a unique connection ID
    const connectionId = Math.floor(Math.random() * 1000000000);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders(); // Flush the headers to establish the connection

    // Register the connection
    this.eventStreamService.registerConnection(recipientId, connectionId);
    this.logger.log(`New SSE connection for user ${recipientId}`);

    // Handle connection close
    req.on('close', () => {
      this.eventStreamService.removeConnection(recipientId, connectionId);
      this.logger.log(`SSE connection closed for user ${recipientId}`);
    });

    // Return the observable stream
    return this.eventStreamService.getStreamForRecipient(recipientId).pipe(
      map((event) => {
        this.logger.debug(
          `Sending event to user ${recipientId}: ${event.type}`,
        );
        return {
          data: this.formatNotification(event),
          id: event.timestamp,
          type: event.type,
          retry: 3000, // Reconnection time in ms
        };
      }),
    );
  }

  private formatNotification(event: StreamEvent): any {
    return {
      ...event.payload,
      type: event.type,
      timestamp: event.timestamp,
    };
  }
}