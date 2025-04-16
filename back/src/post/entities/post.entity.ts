import { AppUser } from 'src/app-user/entities/app-user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column("simple-array")
  listRide: Ride[]; 

  @Column()
  typeOfOffer: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @OneToMany(()=>Comment,comment=>comment.post)
  comments: Comment[];

  @ManyToOne(()=>AppUser,appuser=>appuser.posts)
  user: User;
}
