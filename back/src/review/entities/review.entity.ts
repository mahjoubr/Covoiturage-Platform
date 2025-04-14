import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,ManyToMany,ManyToOne } from "typeorm";

import { AppUser } from "src/app-user/entities/app-user.entity";
@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  stars: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => AppUser)
  reviewer: AppUser;

  @ManyToOne(() => AppUser, user => user.reviews)
  reviewedUser: AppUser;
}
