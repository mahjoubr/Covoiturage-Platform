import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { AppUser } from '../app-user/entities/app-user.entity';
import { Ride } from '../ride/entities/ride.entity';
import { GenericService } from '../services/genericService';
import { ReportStatus } from '../enums/report-status.enum';

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

    async createReport(createDto: CreateReportDto, proofPath: string | null): Promise<Report> {
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

    async findAll(): Promise<Report[]> {
        return this.reportRepo.find({
            relations: ['reporter', 'reportedUser', 'reportedRide'],
            order: { createdAt: 'DESC' },
        });
    }


    async approve(id: number): Promise<Report> {
        const report = await this.reportRepo.findOne({
            where: { id },
            relations: ['reportedUser'],
        });
        if (!report) throw new NotFoundException(`Report ${id} not found`);
        report.status = ReportStatus.ACCEPTED;

        const saved = await this.reportRepo.save(report);

        // 2) Décrémentez la note de reportedUser si > 1
        const user = report.reportedUser;
        if (user && typeof (user as any).rating === 'number' && (user as any).rating > 1) {
            (user as any).rating = (user as any).rating - 1;
            await this.userRepo.save(user);
        }

        return saved;
    }

    async decline(id: number): Promise<Report> {
        const report = await this.reportRepo.findOneBy({ id });
        if (!report) throw new NotFoundException(`Report ${id} not found`);
        report.status = ReportStatus.REJECTED;
        return this.reportRepo.save(report);
    }

    async remove(id: number): Promise<void> {
        const result = await this.reportRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Report ${id} not found`);
        }
    }

    createQueryBuilder(alias: string) {
        return this.reportRepo.createQueryBuilder(alias);
    }
}