import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class QueryPatientDto {
  @IsOptional()
  @IsString()
  search?: string; // matches name, MRN, or phone

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE', 'DECEASED'])
  status?: string;

  @IsOptional()
  @IsIn(['MALE', 'FEMALE', 'OTHER'])
  gender?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
