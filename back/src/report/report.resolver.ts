import { Resolver, Query, Args } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { Report } from './entities/report.entity';
import { ReportPagination } from '../graphql/types/ReportPagination';
import { Int } from 'type-graphql';
import { SearchResult, SearchService } from '../services/searchService';
import { CurrentUser } from 'src/auth/user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/auth.Guard';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { SelectQueryBuilder } from 'typeorm';

@Resolver(() => Report)
export class ReportResolver {
    constructor(
        private readonly reportService: ReportService,
        private readonly searchService: SearchService,
    ) {}

    @UseGuards(GqlAuthGuard)
    @Query(() => ReportPagination)
    async getMyReports(
        @CurrentUser() user: AppUser,
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
        @Args('search', { type: () => String, nullable: true }) search?: string,
        @Args('status', { type: () => String, nullable: true }) status?: string,
    ): Promise<ReportPagination> {
        const qb: SelectQueryBuilder<Report> = this.reportService
            .createQueryBuilder('report')
            .leftJoinAndSelect('report.reporter', 'reporter')
            .leftJoinAndSelect('report.reportedUser', 'reportedUser')
            .leftJoinAndSelect('report.reportedRide', 'reportedRide')
            .orderBy('report.createdAt', 'DESC');

        if (user.role !== 'admin') {
            qb.andWhere('report.reporterId = :userId', { userId: user.id });
        }

        if (status) {
            qb.andWhere('report.status = :status', { status });
        }

        if (search) {
            const fields = ['report.subjectType', 'report.reason'];
            const searchRes: SearchResult<Report> = await this.searchService.searchQuery(
                qb,
                search,
                fields,
                page,
                limit,
            );
            return {
                data: searchRes.data,
                totalItems: searchRes.totalItems,
                totalPages: Math.ceil(searchRes.totalItems / limit),
                currentPage: page,
            };
        }

        const [data, totalItems] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
        };
    }
}
