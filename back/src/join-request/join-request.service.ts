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
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class JoinRequestService {
  private readonly logger = new Logger('EventEmitter');
  constructor(@InjectRepository(JoinRequest) private readonly repo: Repository<JoinRequest>,
  private readonly subscriptionService:SubscriptionService,
  private readonly notificationService:NotificationService,
){}
  async create(data: { user: AppUser; ride: Ride },postId:number): Promise<JoinRequest> {
    const validDate = new Date();
  
    const joinRequest = this.repo.create({
      user: data.user,
      ride: data.ride,
      date: validDate,
    });
  
    const subscribers = await this.subscriptionService.getSubscribers(postId, 'post');
      
    
    //return this.repo.save(joinRequest);
    await this.repo.save(joinRequest);
    const fullJoinRequest = await this.repo.findOne({
      where: { id: joinRequest.id },
      relations: ['user', 'ride'],
    });
if (!fullJoinRequest) throw new Error('JoinRequest not found after creation');
    for (const recipientId of subscribers) {
        
   await this.notificationService.JoinRequestNotification(
  recipientId, // userId (recipient)
  data.user.id, // driverId (the requester)
  fullJoinRequest.ride.id, // ride id
  'New Join Request',
  `${data.user.name} has requested to join your ride`,
  `/post/${postId}`,
);
      
    }
    await this.subscriptionService.subscribe(
      data.user.id,
      data.ride.id,
      'ride' // Entity type
    );
return fullJoinRequest;

  }
  
  async deleteByUserAndRide(userId: number, rideId: number,postId:number): Promise<boolean> {
    const result = await this.repo.delete({ user: { id: userId }, ride: { id: rideId } });

    const subscribers = await this.subscriptionService.getSubscribers(postId, 'post');
      
    for (const recipientId of subscribers) {
       await this.notificationService.JoinRequestNotification(
      recipientId, // userId (recipient)
      postId,      // postId
      -1, // joinRequestId (not applicable for deletion)
      'Join Request Deleted', // title
      `Your join request for the ride has been deleted`, // message
      `/post/${postId}`, // actionUrl
      
    );
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
