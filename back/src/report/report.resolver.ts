// src/report/report.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { CurrentUser } from '../auth/user.decorator'; // adjust path if needed
import { AppUser } from '../app-user/entities/app-user.entity';
import {UseGuards} from "@nestjs/common";
import {Report} from "src/report/entities/report.entity";
import {GqlAuthGuard} from "src/auth/guards/auth.Guard";

@Resolver(() => Report)
export class ReportResolver {
    constructor(private readonly reportService: ReportService) {}

    @Query(() => [Report])
    @UseGuards(GqlAuthGuard)

    async getMyReports(@CurrentUser() user: AppUser): Promise<Report[]> {
        return this.reportService.findByReporter(user.id);
    }
}
