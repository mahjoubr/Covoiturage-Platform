

import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { F } from '@faker-js/faker/dist/airline-BUL6NtOJ';

@ObjectType()
@Entity()
export class Message {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  text: string;

  @Field(() => Chat)
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;
  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User)
  sender: User;
}
