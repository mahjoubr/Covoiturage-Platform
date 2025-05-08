import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { UpdateJoinRequestDto } from './dto/update-join-request.dto';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { JoinRequest } from './entities/join-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventStreamService, EventType } from 'src/SSE/sse-subscription.service';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class JoinRequestService {
  private readonly logger = new Logger('EventEmitter');
  constructor(@InjectRepository(JoinRequest) private readonly repo: Repository<JoinRequest>,
  private readonly subscriptionService:SubscriptionService,
  private readonly eventStreamService:EventStreamService
){}
  async create(data: { user: AppUser; ride: Ride },postId:number): Promise<JoinRequest> {
    const validDate = new Date();
  
    const joinRequest = this.repo.create({
      user: data.user,
      ride: data.ride,
      date: validDate,
    });
  
    const subscribers = await this.subscriptionService.getSubscribers(postId, 'post');
      
    for (const recipientId of subscribers) {
        const event = {
          type: EventType.JOIN_REQUEST,
          targetId: postId,
          recipientId,
          payload: {
            rideId: data.ride.id,
            requesterId: data.user.id,
            timestamp: validDate.toISOString(),
          },
        };
        this.logger.log(`Emitting event: ${JSON.stringify(event)}`);
      this.eventStreamService.emitEvent(event);
      this.logger.log(`Emitted event: ${JSON.stringify(event)}`);
      
    }
    await this.subscriptionService.subscribe(
      data.user.id,
      data.ride.id,
      'ride' // Entity type
    );
    //return this.repo.save(joinRequest);
    await this.repo.save(joinRequest);
    const fullJoinRequest = await this.repo.findOne({
      where: { id: joinRequest.id },
      relations: ['user', 'ride'],
    });
if (!fullJoinRequest) throw new Error('JoinRequest not found after creation');
return fullJoinRequest;

  }
  
  async deleteByUserAndRide(userId: number, rideId: number,postId:number): Promise<boolean> {
    const result = await this.repo.delete({ user: { id: userId }, ride: { id: rideId } });

    const subscribers = await this.subscriptionService.getSubscribers(postId, 'post');
      
    for (const recipientId of subscribers) {
        const event = {
          type: EventType.JOIN_REQUEST,
          targetId: postId,
          recipientId,
          payload: {
            rideId: rideId,
            requesterId: userId,
            timestamp: new Date().toISOString(),
          },
        };
        this.logger.log(`Emitting event: ${JSON.stringify(event)}`);
      this.eventStreamService.emitEvent(event);
      this.logger.log(`Emitted event: ${JSON.stringify(event)}`);
      
    }
    return (result.affected ?? 0) > 0;


  }
  
  
  async findOne(id: number): Promise<JoinRequest> {
    const joinRequest = await this.repo.findOne({ where: { id }, relations: ['user', 'ride'] });
    if (!joinRequest) {
      throw new NotFoundException(`JoinRequest with id ${id} not found`);
    }
    return joinRequest;
  }
  
  
  async findAll(): Promise<JoinRequest[]> {
    return this.repo.find({ relations: ['user', 'ride'] });
  }
  
  async findByRideId(rideId: number): Promise<JoinRequest[]> {
    return this.repo.find({ where: { ride: { id: rideId } }, relations: ['user'] });
  }
  
  async findByRideUser(rideId: number, userId: number): Promise<JoinRequest[]> {
    return this.repo.find({
      where: {
        ride: { id: rideId },
        user: { id: userId },
      }
    });
  }
  // join-request.service.ts
  async deleteById(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return !!result?.affected && result.affected > 0;
  }
  

  
}
