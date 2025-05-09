import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GenericService } from '../services/genericService';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { PaginationResult, PaginationService } from 'src/services/paginationService';
import { SearchService } from 'src/services/searchService';
import { AppUserService } from 'src/app-user/app-user.service';
import { EventStreamService } from 'src/SSE/sse-subscription.service';
import { ReviewPayload } from 'src/SSE/ReviewPayload';

@Injectable()
export class ReviewService extends GenericService {



     constructor(@InjectRepository(Review) private readonly reviewRepository: Repository<Review>,private readonly paginationService: PaginationService,private readonly searchService: SearchService,
        private readonly userService: AppUserService,
        private readonly eventStreamService: EventStreamService,
      ) {
        super(reviewRepository)
        
     }

     async findOne(id: number): Promise<Review> {
      //include the relations you need
      const review = await this.reviewRepository.findOne({ where: { id }, relations: ['reviewer', 'reviewedUser', 'ride'] });
      if (!review) {
        throw new Error('Review not found');
      }
      return review;
     }
     async createReview(createReviewDto: CreateReviewDto) {
      console.log('Creating review:', createReviewDto);
    
      const review = this.reviewRepository.create({
        stars: createReviewDto.stars,
        comment: createReviewDto.comment,
        date: new Date().toISOString().split('T')[0], // Set the current date
        reviewer: { id: createReviewDto.reviewerId },      
        reviewedUser: { id: createReviewDto.reviewedUserId },
        ride: { id: createReviewDto.rideId },               
      });
    
      const savedReview = await this.reviewRepository.save(review);
    
    
      await this.userService.updateUserRating(createReviewDto.reviewedUserId);
      this.emitReviewNotification(createReviewDto, savedReview.id);

    
    }


   async  emitReviewNotification(createReviewDto: CreateReviewDto, reviewId: number) {
      const { reviewedUserId, reviewerId, stars, comment } = createReviewDto;
      const reviewer = await this.userService.findOne(reviewerId); 
      const reviewPayload: ReviewPayload = {
        reviewId,
        reviewerId,
        reviewerName: reviewer.firstName,  
        reviewerLastName: reviewer.firstName, 
        reviewContent: comment,
        rating: stars,
        date: new Date().toISOString().split('T')[0], 
      };
  
      this.eventStreamService.emitReviewEvent(reviewedUserId, reviewPayload);
    }
    
    async deleteReview(userid:number,id: number) {

      const review = await this.findOne(id);
      if (!review) {
        throw new Error('Review not found');
      }
      if(review.reviewer.id !== userid) {
        throw new Error('You are not allowed to delete this review');
      }
    
      await this.reviewRepository.remove(review);
    
      await this.userService.updateUserRating(review.reviewedUser.id);
    }


    async updateReview(userId:number,updateDto:UpdateReviewDto): Promise<any> {
       
        const review = await this.findOne(updateDto.id);
        console.log('Updating review:', review);
        console.log('Update data:', updateDto);
        console.log('User ID:', userId);
        if (!review) {
            throw new Error('Review not found');
        }
        console.log('Reviewer ID:', review.reviewer.id);
        if (!review) {
          throw new Error('Review not found');
      }
        if(review.reviewer.id !== userId) {

            throw new Error('You are not allowed to update this review');
        }
       
        Object.assign(review, updateDto);
        return this.reviewRepository.save(review);
        

    }
     async paginate (page: number, limit: number) {
        const queryBuilder = this.reviewRepository.createQueryBuilder('review');
        return this.paginationService.paginateQuery(queryBuilder, page, limit);
     }

      async search (searchTerm: string, fields: string[], page: number, limit: number) {
          const queryBuilder = this.reviewRepository.createQueryBuilder('review');
          return this.searchService.searchQuery(queryBuilder, searchTerm, fields, page, limit);
      }



      async findByReviewerId(
        userId: number,
        page: number = 1,
        limit: number = 6
      ): Promise<PaginationResult<Review>> {
        const queryBuilder = this.reviewRepository
          .createQueryBuilder('review')
          .leftJoinAndSelect('review.reviewedUser', 'reviewedUser')
          .leftJoinAndSelect('review.ride', 'ride')
          .where('review.reviewer.id = :userId', { userId })
          .orderBy('review.date', 'DESC');
      
        return this.paginationService.paginateQuery(queryBuilder, page, limit);
      }
      
      async findByReviewedUserId(
        userId: number,
        page: number = 1,
        limit: number = 6
      ): Promise<PaginationResult<Review>> {
        const queryBuilder = this.reviewRepository
          .createQueryBuilder('review')
          .leftJoinAndSelect('review.reviewer', 'reviewer')
          .leftJoinAndSelect('review.ride', 'ride')
          .where('review.reviewedUser.id = :userId', { userId })
          .orderBy('review.date', 'DESC');
      
        return this.paginationService.paginateQuery(queryBuilder, page, limit);
      }

      async findByRideId (rideId: number) {
        return this.reviewRepository.find({ where: { ride: { id: rideId } } });
      }
      async findByReviewerIdAndRideId (reviewerId: number, rideId: number) {  
        return this.reviewRepository.find({ where: { reviewer: { id: reviewerId }, ride: { id: rideId } } });
      }



}
