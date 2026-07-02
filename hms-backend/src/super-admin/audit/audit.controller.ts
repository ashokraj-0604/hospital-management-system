import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('action') action?: string,
    @Query('hospital_id') hospital_id?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.findAll({
      search, action, hospital_id,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }
}