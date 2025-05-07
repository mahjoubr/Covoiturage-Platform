import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { CommentResolver } from './comment.resolver';
import { Comment } from './entities/comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Comment, Post, AppUser])],
  controllers: [CommentController],
  providers: [CommentService,CommentResolver],
    exports: [CommentService],
})
export class CommentModule {}
