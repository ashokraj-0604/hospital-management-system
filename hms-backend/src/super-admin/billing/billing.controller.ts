import { Controller, Get, Query } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('invoices')
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.billingService.findAll({
      search, status,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }
}