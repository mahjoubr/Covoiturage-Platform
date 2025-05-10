// src/report/report.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { AppUser } from '../app-user/entities/app-user.entity';
import { Ride } from '../ride/entities/ride.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import {ReportResolver} from "src/report/report.resolver";
import {SearchService} from "src/services/searchService";
import {PaginationService} from "src/services/paginationService";

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, AppUser, Ride]),
  ],
  providers: [ReportResolver,ReportService, SearchService,PaginationService],
  controllers: [ReportController],
  exports: [ReportService],

})
export class ReportModule {}
