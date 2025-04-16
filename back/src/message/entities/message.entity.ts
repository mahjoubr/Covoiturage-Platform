import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToOne(()=>User,{ eager: true })
  sender: User;

  @ManyToOne(()=>User,{ eager: true })
  receiver: User;

  @ManyToOne(()=>Chat,chat=>chat.messages)
  chat: Chat;
}
