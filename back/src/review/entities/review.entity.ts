import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,ManyToMany,ManyToOne } from "typeorm";

import { AppUser } from "src/app-user/entities/app-user.entity";
import { Ride } from "src/ride/entities/ride.entity";
import { Max, Min } from "class-validator";
@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  @Min(1, { message: "Stars must be at least 1" }) // Enforce min value
  @Max(5, { message: "Stars must be at most 5" }) // Enforce max value
  stars: number; // 1-5

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => AppUser)
  reviewer: AppUser;

  @ManyToOne(() => AppUser, user => user.reviews)
  reviewedUser: AppUser;

  @ManyToOne(()=>Ride, {eager: true})
  ride : Ride;
}
