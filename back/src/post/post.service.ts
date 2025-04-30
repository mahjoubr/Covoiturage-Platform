import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericService } from '../services/genericService';

@Injectable()
export class PostService extends GenericService {
  constructor(@InjectRepository(Post) private readonly postRepo: Repository<Post>) {
    super(postRepo);
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
