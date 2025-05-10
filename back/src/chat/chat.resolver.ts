import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Chat } from './entities/chat.entity';
import { ChatService } from './chat.service';

@Resolver(()=>Chat)
export class ChatResolver {
    constructor(
         private readonly chatService: ChatService,
    ) {}

    
  @Query(() => [Chat], { name: 'getChats' })
  async GetChats(@Args('userId', { type: () => Int }) userId: number) : Promise<Chat[]>{
    


  return this.chatService.findByUserId(userId);
  }
}
