import { AppUser } from 'src/app-user/entities/app-user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  destination: string;

  @Column({ type: 'varchar' })
  departure: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar' })
  time: string;

  @Column({ type: 'int' })
  seatCount: number;

  @Column({ type: 'varchar' })
  frequency: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'float', nullable: true })
  price?: number;

  @Column({ type: 'varchar', nullable: true })
  contactInfo?: string;

  @OneToMany(() => Comment, comment => comment.post, { cascade: true })
  comments?: Comment[];

  @ManyToOne(() => AppUser, user => user.posts)
  postOwner: AppUser;

  @Column("simple-array")
  listRide: Ride[]; 
}
