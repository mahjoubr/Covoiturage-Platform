// src/report/report.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { AppUser } from '../app-user/entities/app-user.entity';
import { Ride } from '../ride/entities/ride.entity';
import { GenericService } from 'src/services/genericService';
import {ReportStatus} from "src/enums/report-status.enum";

@Injectable()
export class ReportService extends GenericService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepo: Repository<Report>,

        @InjectRepository(AppUser)
        private readonly userRepo: Repository<AppUser>,

        @InjectRepository(Ride)
        private readonly rideRepo: Repository<Ride>,
    ) {
        super(reportRepo);
    }

    async createReport(createDto: CreateReportDto, proofPath: string |null): Promise<Report> {
        const reporter = await this.userRepo.findOneBy({ id: createDto.reporterId });
        if (!reporter) throw new NotFoundException('Reporter not found');

        const reportedUser = await this.userRepo.findOneBy({ id: createDto.reportedUserId });
        if (!reportedUser) throw new NotFoundException('Reported user not found');

        const report = this.reportRepo.create({
            subjectType: createDto.subjectType,
            reason: createDto.reason,
            reporter,
            reportedUser,
            status: ReportStatus.PENDING,
        });

        if (createDto.reportedRideId) {
            const ride = await this.rideRepo.findOneBy({ id: createDto.reportedRideId });
            if (!ride) throw new NotFoundException('Reported ride not found');
            report.reportedRide = ride;
        }

        if (proofPath) {
            report.proofPath = proofPath;
            report.proofUrl = `/uploads/proofs/${proofPath.split('\\').pop()}`;
        }

        return this.reportRepo.save(report);
    }
    async findByReporter(userId: number): Promise<Report[]> {
        return this.reportRepo.find({
            where: {reporter: {id: userId}},
            order: {createdAt: 'DESC'},
        });
    }
}
