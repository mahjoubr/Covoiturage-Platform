import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GenericService } from '../services/genericService';
import { CreatePostInput } from './dto/post-graphql.dto';
import { Ride } from 'src/ride/entities/ride.entity';
import { AppUserService } from 'src/app-user/app-user.service';

@Injectable()
export class PostService extends GenericService {
  constructor(@InjectRepository(Post) private readonly postRepo: Repository<Post>,@InjectRepository(Ride) private rideRepo: Repository<Ride>,private readonly userService: AppUserService) {
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
    
    return this.postRepo.save(post);
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
  
  
}
