// src/report/report.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseInterceptors(
      FileInterceptor('proof', {
        storage: diskStorage({
          destination: './uploads/proofs',
          filename: (_req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      }),
  )
  async createReport(
      @UploadedFile() file: Express.Multer.File,
      @Body() createReportDto: CreateReportDto,
  ) {
    console.log("controller atteint");
    const proofPath = file ? file.path : null;

    // Call the service with or without the file path
    return this.reportService.createReport(createReportDto, proofPath);
  }
}