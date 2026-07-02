import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsEmail,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsDateString()
  date_of_birth: string;

  @IsIn(['MALE', 'FEMALE', 'OTHER'])
  gender: string;

  @IsOptional()
  @IsIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'])
  blood_group?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  emergency_contact_name?: string;

  @IsOptional()
  @IsString()
  emergency_contact_phone?: string;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsOptional()
  @IsString()
  insurance_provider?: string;

  @IsOptional()
  @IsString()
  insurance_policy_number?: string;

  @IsOptional()
  @IsIn(['WALK_IN', 'REFERRED', 'PRE_REGISTERED'])
  registration_type?: string;

  // Set true when the frontend has already shown the user a duplicate
  // warning and they confirmed they want to proceed anyway
  @IsOptional()
  @IsBoolean()
  duplicate_override?: boolean;
}
