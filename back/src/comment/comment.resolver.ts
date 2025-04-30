import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentInput } from './dto/create-comment.input';
import { Post } from '../post/entities/post.entity';
import { AppUser } from '../app-user/entities/app-user.entity';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(AppUser)
    private userRepository: Repository<AppUser>,
  ) {}

  @Query(() => [Comment])
  async getAllComments(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['post', 'commenter'] });
  }

  @Query(() => [Comment])
  async getCommentsByPost(@Args('postId', { type: () => Int }) postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['commenter', 'post'],
    });
  }

  @Mutation(() => Comment)
  async createComment(
    @Args('input') input: CreateCommentInput,
  ): Promise<Comment> {
    const post = await this.postRepository.findOneByOrFail({ id: input.postId });
    const commenter = await this.userRepository.findOneByOrFail({ id: input.commenterId });

    const comment = this.commentRepository.create({
      text: input.text,
      date: new Date(),
      post,
      commenter,
    });

    return this.commentRepository.save(comment);
  }
}
