import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from './entities/report.entity';
import { AppUserModule } from 'src/app-user/app-user.module';
import { RideModule } from 'src/ride/ride.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    AppUserModule,
    RideModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService], // optional, if needed elsewhere
})
export class ReportModule {}
