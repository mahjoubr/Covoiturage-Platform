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
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CommentService extends GenericService {
  private readonly logger = new Logger('EventEmitter');
  constructor(@InjectRepository(Comment) private readonly repo: Repository<Comment>,private readonly userService: AppUserService,
  private readonly postService : PostService,
  private readonly subscriptionService:SubscriptionService,
  private readonly eventStreamService:EventStreamService,
  private readonly notificationService:NotificationService

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

      
    this.notificationService.commentNotification(
      recipientId, // userId (recipient)
      post.id,     // postId
      savedComment.id, // commentId
      'New Comment', // title
      `${commenter.name} commented on your post`, // message
      `/post/${post.id}`, // actionUrl
      { commentId: savedComment.id, postId: post.id, commenterId: commenter.id } // metadata (optional)
    );
    
    }
  }
  return savedComment;
}

}
