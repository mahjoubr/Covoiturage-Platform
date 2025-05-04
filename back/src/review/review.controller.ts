import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }


  @Get('paginate')
  paginate(@Param('page') page: number, @Param('limit') limit: number) {
    return this.reviewService.paginate(page, limit);
  }
  @Get('search')
  search(@Param('searchTerm') searchTerm: string, @Param('fields') fields: string[], @Param('page') page: number, @Param('limit') limit: number) {
    return this.reviewService.search(searchTerm, fields, page, limit);

  }

  @Get('reviewedUser/:reviewedUserId')
  findByReviewedUserId(@Param('reviewedUserId') reviewedUserId: number) {
    return this.reviewService.findByReviewedUserId(reviewedUserId);
  }
  @Get('reviewer/:reviewerId')
  findByReviewerId(@Param('reviewerId') reviewerId: number) {
    return this.reviewService.findByReviewerId(reviewerId);
  }
  @Get('ride/:rideId')
  findByRideId(@Param('rideId') rideId: number) {
    return this.reviewService.findByRideId(rideId);
  }


  
    @Get('reviewer/:reviewerId/ride/:rideId')
    findByReviewerIdAndRideId(@Param('reviewerId') reviewerId: number, @Param('rideId') rideId: number) {
      return this.reviewService.findByReviewerIdAndRideId(reviewerId, rideId);
    }
}
