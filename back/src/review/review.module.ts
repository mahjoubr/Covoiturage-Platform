import { Module, Search } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { PaginationService } from 'src/services/paginationService';
import { SearchService } from 'src/services/searchService';
import { UserService } from 'src/user/user.service';
import { AppUserService } from 'src/app-user/app-user.service';
import { AppUserModule } from 'src/app-user/app-user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Review]),AppUserModule],
  controllers: [ReviewController],
  providers: [ReviewService,PaginationService,SearchService ],
  exports: [ReviewService],
})
export class ReviewModule {}
