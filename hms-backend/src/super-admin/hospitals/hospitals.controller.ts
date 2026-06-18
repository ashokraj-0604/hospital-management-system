import {
  Controller, Get, Post, Patch, Body,
  Param, Query, HttpCode
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';

@Controller('hospitals')
export class HospitalsController {
  constructor(private hospitalsService: HospitalsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('plan') plan?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.hospitalsService.findAll({
      search, status, plan,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Get('stats')
  getStats() {
    return this.hospitalsService.getStats();
  }

  @Post()
  @HttpCode(200)
  create(@Body() body: any) {
    // TODO: get actor from JWT guard — hardcoded for now
    return this.hospitalsService.create(body, 'system', 'Super Admin');
  }

  @Patch(':id/suspend')
  @HttpCode(200)
  suspend(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.hospitalsService.suspend(id, body.reason, 'system', 'Super Admin');
  }

  @Patch(':id/activate')
  @HttpCode(200)
  activate(@Param('id') id: string) {
    return this.hospitalsService.activate(id, 'system', 'Super Admin');
  }
}