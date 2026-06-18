import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export type HospitalStatus = 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'INACTIVE';
export type SubscriptionPlan = 'BASIC' | 'STANDARD' | 'ENTERPRISE';

@Entity('hospitals')
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  hospital_id: string;

  @Column({ type: 'varchar', unique: true })
  hospital_name: string;

  @Column({ type: 'varchar', unique: true })
  hospital_code: string;

  @Column({ type: 'varchar' })
  mrn_prefix: string;

  @Column({ type: 'varchar', nullable: true })
  gstin: string | null;

  @Column({ type: 'varchar' })
  primary_email: string;

  @Column({ type: 'varchar' })
  primary_phone: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  state: string;

  @Column({ type: 'varchar' })
  pincode: string;

  @Column({ type: 'varchar', default: 'TRIAL' })
  status: HospitalStatus;

  @Column({ type: 'varchar', default: 'BASIC' })
  subscription_plan: SubscriptionPlan;

  @Column({ type: 'varchar', default: '#33ABC3' })
  primary_color: string;

  @Column({ type: 'varchar', default: '#1B3A5C' })
  secondary_color: string;

  @Column({ type: 'varchar', nullable: true })
  logo_url: string | null;

  @Column({ type: 'varchar', nullable: true })
  subdomain: string | null;

  @Column({ type: 'int', default: 0 })
  total_beds: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}