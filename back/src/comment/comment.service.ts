import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GenericService } from 'src/services/genericService';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService extends GenericService {
  constructor(@InjectRepository(Comment) private readonly repo: Repository<Comment>) {
    super(repo);
  }


}
