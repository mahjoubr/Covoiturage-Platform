import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MessageService } from 'src/message/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { MessageModule } from 'src/message/message.module';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, User, Ride]),
    MessageModule
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway,ChatResolver],
})
export class ChatModule {}
