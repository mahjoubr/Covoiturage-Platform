import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './entities/report.entity';
import {GenericService} from "src/services/genericService";

@Injectable()
export class ReportService extends GenericService{
  constructor(
      @InjectRepository(Report)
      private readonly reportRepository: Repository<Report>,
  ) {
    super(reportRepository);}


  
}