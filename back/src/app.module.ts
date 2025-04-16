import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RideModule } from './ride/ride.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { RatingModule } from './rating/rating.module';
import { UserModule } from './user/user.module';
import { AppUserModule } from './app-user/app-user.module';
import { AdminModule } from './admin/admin.module';
import { AppUserRideModule } from './app-user-ride/app-user-ride.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [RideModule, PostModule, CommentModule, MessageModule, ChatModule, RatingModule, UserModule, AppUserModule, AdminModule, AppUserRideModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
