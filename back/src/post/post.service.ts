import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostStatus } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Not, Repository } from 'typeorm';
import { GenericService } from '../services/genericService';
import { CreatePostInput } from './dto/post-graphql.dto';
import { Ride, RideState } from 'src/ride/entities/ride.entity';
import { AppUserService } from 'src/app-user/app-user.service';
import { CreateRideInput } from 'src/ride/dto/create-ride.input';
import { RideService } from 'src/ride/ride.service';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class PostService extends GenericService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Ride) private rideRepo: Repository<Ride>,
    private readonly userService: AppUserService,
    private readonly subscriptionService : SubscriptionService,
    private readonly rideService: RideService) {
    super(postRepo);
  }
  async create(createPostInput: CreatePostInput): Promise<Post> {
    const { postOwnerId, listRide, ...rest } = createPostInput;
  
    const post = this.postRepo.create(rest);
  
    const user = await this.userService.findOne(postOwnerId);
    if (!user) {
      throw new NotFoundException(`User with ID ${postOwnerId} not found`);
    }
    post.postOwner = user;
  
    if (listRide?.length) {
      post.listRide = await this.rideRepo.findBy({ id: In(listRide) });
    
      if (post.listRide.length !== listRide.length) {
        throw new BadRequestException('Some ride IDs are invalid');
      }
    }
    
    const savedPost = await this.postRepo.save(post);

    // Create initial ride for this post
    const rideInput: CreateRideInput = {
      date: createPostInput.date,
      time: createPostInput.time,
      departure: createPostInput.departure,
      arrival: createPostInput.destination,
      price: createPostInput.price ?? 0, // fallback if price is undefined
      nbPassengers: createPostInput.seatCount,
      state: RideState.NOT_STARTED,
    };
  
    // Create ride using rideService
    await this.rideService.createRide(rideInput, savedPost);

    //HERE
    await this.subscriptionService.subscribe(
      postOwnerId,
      post.id,
      'post' // Entity type
    );
    //ENDS HERE
    return savedPost;

  }
  
  
  async findAll(options = {}): Promise<Post[]> {
    return this.postRepo.createQueryBuilder('post')
  .leftJoinAndSelect('post.postOwner', 'postOwner')
  .leftJoinAndSelect('post.listRide', 'listRide')
  .leftJoinAndSelect('post.comments', 'comments')
.leftJoinAndSelect('comments.commenter', 'commenter')

  .getMany();

  }
  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.createQueryBuilder('post')
      .leftJoinAndSelect('post.listRide', 'listRide')
      .leftJoinAndSelect('post.postOwner', 'postOwner')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.commenter', 'commenter')
      .where('post.id = :id', { id })
      .getOne();
  
    if (!post) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
  
    return post;
  }
  async close(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });
  
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  
    post.status = PostStatus.CLOSED;
  
    return await this.postRepo.save(post);
  }

  async findMatchingRideAndOwner(postId: number): Promise<{ ride: Ride | null; postOwnerId: number | null }> {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['listRide', 'postOwner'],
    });
  
    if (!post) return { ride: null, postOwnerId: null };
  
    const matchingRide = post.listRide.find((ride) => ride.state === RideState.NOT_STARTED);
  
    return {
      ride: matchingRide ?? null,
      postOwnerId: post.postOwner?.id ?? null,
    };
  }
  async remove(postId: number): Promise<void> {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['listRide'],
    });
  
    if (!post) {
      throw new Error('Post not found');
    }
    
  
    // Find and delete the matching ride
    const matchingRide = post?.listRide[post.listRide.length - 1] ?? null;
  
    if (matchingRide) {
      await this.rideRepo.delete(matchingRide.id);
    }
  
    // Refresh the list of rides after deletion
    const updatedPost = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['listRide'],
    });
  
    if (!updatedPost || updatedPost.listRide.length === 0) {
      // If no rides left, delete the post
      await this.postRepo.delete(postId);
    } else {
      // Find the next matching ride and update post's date/time
      
      const nextRide = updatedPost?.listRide[updatedPost.listRide.length - 1] ?? null;
      
  
      if (nextRide) {
        updatedPost.date = nextRide.date;
        updatedPost.time = nextRide.time;
        updatedPost.status=PostStatus.CLOSED;
        await this.postRepo.save(updatedPost);
      }
    }
  }
 
  
  
}
