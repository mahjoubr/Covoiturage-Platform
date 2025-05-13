import { Controller, Sse, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { EventStreamService, StreamEvent } from './sse-subscription.service';

interface SseMessageEvent {
  data: string | object;
  id?: number;
  type?: string;
  retry?: number;
}

@Controller('events')
export class EventStreamController {
  constructor(private readonly eventStreamService: EventStreamService) {}

  @Sse('stream/:recipientId')
  subscribeToEvents(
    @Param('recipientId') recipientId: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Observable<SseMessageEvent> {
    const connectionId = Math.floor(Math.random() * 1000000000);

    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); 
    
    this.eventStreamService.registerConnection(recipientId, connectionId);
    
    req.on('close', () => {
      this.eventStreamService.removeConnection(recipientId, connectionId);
    });
    
    return this.eventStreamService.getStreamForRecipient(recipientId).pipe(
      map(event => ({
        data: JSON.stringify(event.payload),
        id: Number(event.timestamp),
        type: event.type
      }))
    );
  }
}
