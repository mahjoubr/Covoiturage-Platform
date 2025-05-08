import { Injectable, Logger } from '@nestjs/common';
import { GenericService } from 'src/services/genericService';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentInput } from './dto/create-comment.input';
import { AppUserService } from 'src/app-user/app-user.service';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { PostService } from 'src/post/post.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { EventStreamService, EventType } from 'src/SSE/sse-subscription.service';

@Injectable()
export class CommentService extends GenericService {
  private readonly logger = new Logger('EventEmitter');
  constructor(@InjectRepository(Comment) private readonly repo: Repository<Comment>,private readonly userService: AppUserService,
  private readonly postService : PostService,
  private readonly subscriptionService:SubscriptionService,
  private readonly eventStreamService:EventStreamService,
  
) {
    super(repo);
  } 
async createCommentWithNotif(createDto: CreateCommentInput, commenter: AppUser): Promise<Comment> {
  const post = await this.postService.findOne(createDto.postId);
  const comment = this.repo.create({
    text: createDto.text,
    date: new Date(),
    post,
    commenter,
  });

  const savedComment = await this.repo.save(comment);
  const subscribers = await this.subscriptionService.getSubscribers(post.id, 'post');
  
  for (const recipientId of subscribers) {
    if (recipientId !== commenter.id) {
      const event = {
        type: EventType.NEW_COMMENT,
        targetId: post.id,
        recipientId,
        payload: {
          postId: post.id,
          commentId: comment.id,
          commentAuthor: commenter.id,
          commentText: comment.text?.substring(0, 100),
          timestamp: new Date().toISOString(),
        },
      };
      this.logger.log(`Emitting event: ${JSON.stringify(event)}`);
    this.eventStreamService.emitEvent(event);
    this.logger.log(`Emitted event: ${JSON.stringify(event)}`);
    }
  }
  return savedComment;
}

}
