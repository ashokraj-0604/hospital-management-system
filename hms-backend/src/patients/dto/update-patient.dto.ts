import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE', 'DECEASED'])
  status?: string;
}
