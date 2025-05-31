
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

registerEnumType(NotificationStatus, {
  name: 'NotificationStatus',
});

@ObjectType()
@Entity('notifications')
export class Notification {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  userId: number;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  message: string;

  @Field(() => NotificationStatus)
  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  actionUrl?: string;

  @Field(() => GraphQLJSON, { nullable: true })
@Column('json', { nullable: true })
metadata?: Record<string, any>;


  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  relatedEntityId?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  relatedEntityType?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}