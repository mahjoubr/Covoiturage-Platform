import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { MessageResolver } from './message.resolver';
import { PubSub } from 'graphql-subscriptions';


@Module({
  imports: [TypeOrmModule.forFeature([Message,Chat,User])], 
  exports: [MessageService], 
  controllers: [MessageController],
  providers: [MessageService, MessageResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    }],
})
export class MessageModule {}
