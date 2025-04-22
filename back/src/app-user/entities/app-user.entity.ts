import { ChildEntity, Column, Entity, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Review } from 'src/review/entities/review.entity';
import { AppUserRide } from 'src/app-user-ride/entities/app-user-ride.entity';
@ChildEntity()
export class AppUser extends User {
  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  phoneNumber: string;

  @Column()
  imageUrl: string;

  @OneToMany(()=>Post,post=>post.postOwner)
  posts:Post[];

  @OneToMany(() => Review, review => review.reviewedUser)
  reviews: Review[];

  @Column({ type: 'float' })
  rating: number; 
  
  @OneToMany(() => AppUserRide, appUserRide => appUserRide.appUser)
  appUserRides: AppUserRide[];

}
