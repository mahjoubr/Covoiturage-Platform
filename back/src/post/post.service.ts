import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GenericService } from 'src/services/genericService';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService extends GenericService {
  constructor(@InjectRepository(Post) private readonly postRepo:Repository<Post>){
    super(postRepo);
  }
}
