import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GenericService } from '../services/genericService';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/services/paginationService';
import { SearchService } from 'src/services/searchService';
import { AppUserService } from 'src/app-user/app-user.service';

@Injectable()
export class ReviewService extends GenericService {



     constructor(@InjectRepository(Review) private readonly reviewRepository: Repository<Review>,private readonly paginationService: PaginationService,private readonly searchService: SearchService,
        private readonly userService: AppUserService) {
        super(reviewRepository)
        
     }

     async createReview(createReviewDto: CreateReviewDto) {
    
      const review = this.reviewRepository.create({
        stars: createReviewDto.stars,
        comment: createReviewDto.comment,
        reviewer: { id: createReviewDto.reviewerId },      
        reviewedUser: { id: createReviewDto.reviewedUserId },
        ride: { id: createReviewDto.rideId },               
      });
    
      await this.reviewRepository.save(review);
    
    
      await this.userService.updateUserRating(createReviewDto.reviewedUserId);
    
    }
    

     async paginate (page: number, limit: number) {
        const queryBuilder = this.reviewRepository.createQueryBuilder('review');
        return this.paginationService.paginateQuery(queryBuilder, page, limit);
     }

      async search (searchTerm: string, fields: string[], page: number, limit: number) {
          const queryBuilder = this.reviewRepository.createQueryBuilder('review');
          return this.searchService.searchQuery(queryBuilder, searchTerm, fields, page, limit);
      }



      async findByReviewedUserId (reviewedUserId: number) {
        return this.reviewRepository.find({ where: { reviewedUser: { id: reviewedUserId } } });
      }
      async findByReviewerId (reviewerId: number) {
        return this.reviewRepository.find({ where: { reviewer: { id: reviewerId } } });
      }

      async findByRideId (rideId: number) {
        return this.reviewRepository.find({ where: { ride: { id: rideId } } });
      }
      async findByReviewerIdAndRideId (reviewerId: number, rideId: number) {  
        return this.reviewRepository.find({ where: { reviewer: { id: reviewerId }, ride: { id: rideId } } });
      }


}
