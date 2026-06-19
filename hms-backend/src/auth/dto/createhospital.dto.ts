import {
  IsString, IsEmail, IsOptional, IsNotEmpty,
  IsIn, MaxLength, MinLength, Matches, IsInt, Min,
} from 'class-validator';

export class CreateHospitalDto {
  // ── Hospital entity fields (match Hospital entity exactly) ────────────────

  @IsString() @IsNotEmpty() @MaxLength(200)
  hospital_name: string;

  /** Uppercase letters, digits, hyphens only — e.g. "APOLLO-CHN" */
  @IsString() @IsNotEmpty() @MaxLength(20)
  @Matches(/^[A-Z0-9-]+$/, { message: 'hospital_code must be uppercase letters, digits, or hyphens' })
  hospital_code: string;

  @IsString() @IsNotEmpty()
  address: string;

  @IsString() @IsNotEmpty() @MaxLength(100)
  city: string;

  @IsString() @IsNotEmpty() @MaxLength(100)
  state: string;

  @IsString() @IsNotEmpty() @MaxLength(10)
  pincode: string;

  @IsString() @IsNotEmpty() @MaxLength(15)
  primary_phone: string;

  @IsEmail() @IsNotEmpty()
  primary_email: string;

  @IsString() @IsIn(['BASIC', 'STANDARD', 'ENTERPRISE'])
  subscription_plan: 'BASIC' | 'STANDARD' | 'ENTERPRISE';

  // Optional hospital fields
  @IsOptional() @IsString() @MaxLength(10)
  mrn_prefix?: string;           // auto-derived from hospital_code if omitted

  @IsOptional() @IsString() @MaxLength(15)
  gstin?: string;

  @IsOptional() @IsString() @MaxLength(255)
  logo_url?: string;

  @IsOptional() @IsString() @MaxLength(100)
  subdomain?: string;            // defaults to hospital_code.toLowerCase()

  @IsOptional() @IsString() @MaxLength(7)
  primary_color?: string;        // hex — defaults to '#33ABC3'

  @IsOptional() @IsString() @MaxLength(7)
  secondary_color?: string;      // hex — defaults to '#1B3A5C'

  @IsOptional() @IsInt() @Min(0)
  total_beds?: number;

  // ── Admin account fields ──────────────────────────────────────────────────

  /** Name of the hospital admin user */
  @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(100)
  admin_name: string;

  /** Login email for the hospital admin — must be globally unique in users table */
  @IsEmail() @IsNotEmpty()
  admin_email: string;
}