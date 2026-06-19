import {
  Controller, Get, Post, Patch, Body,
  Param, Query, HttpCode, Req, UseGuards,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from '../../auth/dto/createhospital.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorators';

@Controller('hospitals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class HospitalsController {
  constructor(private hospitalsService: HospitalsService) {}

  // GET /hospitals?search=&status=&plan=&page=&limit=
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('plan')   plan?: string,
    @Query('page')   page?: string,
    @Query('limit')  limit?: string,
  ) {
    return this.hospitalsService.findAll({
      search, status, plan,
      page:  page  ? +page  : 1,
      limit: limit ? +limit : 20,
    });
  }

  // GET /hospitals/stats
  @Get('stats')
  getStats() {
    return this.hospitalsService.getStats();
  }

  /**
   * POST /hospitals
   * Creates the hospital row AND the hospital admin login in one transaction.
   * Actor (super admin) is read from the JWT payload — no more hardcoded 'system'.
   */
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateHospitalDto, @Req() req: any) {
    const { userId, email } = req.user;         // set by JwtStrategy.validate()
    return this.hospitalsService.createWithAdmin(dto, userId, email);
  }

  // PATCH /hospitals/:id/suspend
  @Patch(':id/suspend')
  @HttpCode(200)
  suspend(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Req() req: any,
  ) {
    const { userId, email } = req.user;
    return this.hospitalsService.suspend(id, body.reason, userId, email);
  }

  // PATCH /hospitals/:id/activate
  @Patch(':id/activate')
  @HttpCode(200)
  activate(@Param('id') id: string, @Req() req: any) {
    const { userId, email } = req.user;
    return this.hospitalsService.activate(id, userId, email);
  }
}