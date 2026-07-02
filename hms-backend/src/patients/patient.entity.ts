import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodGroup =
  | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN';
export type RegistrationType = 'WALK_IN' | 'REFERRED' | 'PRE_REGISTERED';
export type PatientStatus = 'ACTIVE' | 'INACTIVE' | 'DECEASED';

@Entity('patients')
@Index(['hospital_id', 'phone'])
@Index(['hospital_id', 'full_name', 'date_of_birth'])
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  patient_id: string;

  // Medical Record Number — auto-generated, unique per hospital
  @Column({ type: 'varchar', unique: true })
  mrn: string;

  @Column({ type: 'varchar' })
  hospital_id: string;

  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'date' })
  date_of_birth: string;

  @Column({ type: 'varchar' })
  gender: string;

  @Column({ type: 'varchar', default: 'UNKNOWN' })
  blood_group: BloodGroup;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', nullable: true })
  emergency_contact_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  emergency_contact_phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  photo_url: string | null;

  @Column({ type: 'varchar', nullable: true })
  insurance_provider: string | null;

  @Column({ type: 'varchar', nullable: true })
  insurance_policy_number: string | null;

  @Column({ type: 'varchar', default: 'WALK_IN' })
  registration_type: RegistrationType;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: PatientStatus;

  // Set when this record was flagged and confirmed as a potential
  // duplicate override at registration time (kept for audit purposes)
  @Column({ type: 'boolean', default: false })
  duplicate_override: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
