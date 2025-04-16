import { AppUser } from 'src/app-user/entities/app-user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'timestamp' })
  date: Date;
  
  @ManyToOne(()=>Post,post=>post.comments)
  post: Post;

  @ManyToOne(()=>AppUser,{eager: true})
  commenter: AppUser;
  
}
