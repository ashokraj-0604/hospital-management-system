import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  UseGuards, Req
} from '@nestjs/common';
import { PatientsService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';
// TODO: replace with JwtAuthGuard + hospital_id extracted from token
// once auth guards land (see Pending Next Steps #4). Matches the same
// temporary pattern used in hospital-admin.controller.ts.


@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

@Get()
findAll(
  @Req() req: AuthRequest,
  @Query() query: QueryPatientDto,
) {
  return this.patientsService.findAll(
    req.user.hospitalId!,
    query,
  );
}
  

  @Get('check-duplicate')
  checkDuplicate(
    @Req() req: AuthRequest,
    @Query('full_name') full_name: string,
    @Query('date_of_birth') date_of_birth: string,
    @Query('phone') phone: string,
  ) {
    return this.patientsService.findDuplicates(
      req.user.hospitalId!,
      full_name,
      date_of_birth,
      phone,
    );
  }

  @Get(':id')
  findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.patientsService.findOne(req.user.hospitalId!, id);
  }

  @Post()
  @HttpCode(201)
  create(@Req() req: AuthRequest, @Body() dto: CreatePatientDto) {
    return this.patientsService.create(req.user.hospitalId!, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientsService.update(req.user.hospitalId!, id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  deactivate(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.patientsService.deactivate(req.user.hospitalId!, id);
  }
}
