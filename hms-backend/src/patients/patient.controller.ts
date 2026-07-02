import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { PatientsService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';

// TODO: replace with JwtAuthGuard + hospital_id extracted from token
// once auth guards land (see Pending Next Steps #4). Matches the same
// temporary pattern used in hospital-admin.controller.ts.
function getHospitalId(headers: Record<string, string>): string {
  return headers['x-hospital-id'] ?? 'default-hospital';
}

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(@Headers() headers: Record<string, string>, @Query() query: QueryPatientDto) {
    return this.patientsService.findAll(getHospitalId(headers), query);
  }

  @Get('check-duplicate')
  checkDuplicate(
    @Headers() headers: Record<string, string>,
    @Query('full_name') full_name: string,
    @Query('date_of_birth') date_of_birth: string,
    @Query('phone') phone: string,
  ) {
    return this.patientsService.findDuplicates(
      getHospitalId(headers),
      full_name,
      date_of_birth,
      phone,
    );
  }

  @Get(':id')
  findOne(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.patientsService.findOne(getHospitalId(headers), id);
  }

  @Post()
  @HttpCode(201)
  create(@Headers() headers: Record<string, string>, @Body() dto: CreatePatientDto) {
    return this.patientsService.create(getHospitalId(headers), dto);
  }

  @Patch(':id')
  update(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientsService.update(getHospitalId(headers), id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  deactivate(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.patientsService.deactivate(getHospitalId(headers), id);
  }
}
