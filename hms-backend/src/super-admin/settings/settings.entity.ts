import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('platform_settings')
export class PlatformSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Platform Identity
  @Column({ type: 'varchar', default: 'MedSocio HMS' })
  platform_name: string;

  @Column({ type: 'varchar', default: 'support@medsocio.com' })
  support_email: string;

  @Column({ type: 'varchar', default: '+91 1800 000 0000' })
  support_phone: string;

  @Column({ type: 'varchar', default: '#33ABC3' })
  primary_color: string;

  // Security
  @Column({ type: 'boolean', default: true })
  enforce_mfa: boolean;

  @Column({ type: 'int', default: 60 })
  session_timeout_minutes: number;

  @Column({ type: 'int', default: 5 })
  max_login_attempts: number;

  @Column({ type: 'int', default: 30 })
  lockout_duration_minutes: number;

  @Column({ type: 'boolean', default: true })
  pw_require_uppercase: boolean;

  @Column({ type: 'boolean', default: true })
  pw_require_number: boolean;

  @Column({ type: 'boolean', default: true })
  pw_require_special: boolean;

  @Column({ type: 'boolean', default: false })
  pw_prevent_reuse: boolean;

  // Notifications
  @Column({ type: 'boolean', default: true })
  notify_new_hospital: boolean;

  @Column({ type: 'boolean', default: true })
  notify_subscription_expiring: boolean;

  @Column({ type: 'boolean', default: true })
  notify_payment_overdue: boolean;

  @Column({ type: 'boolean', default: true })
  notify_hospital_suspended: boolean;

  @Column({ type: 'boolean', default: false })
  notify_failed_logins: boolean;

  @Column({ type: 'boolean', default: false })
  notify_daily_summary: boolean;

  // SMTP
  @Column({ type: 'varchar', default: 'smtp.sendgrid.net' })
  smtp_host: string;

  @Column({ type: 'int', default: 587 })
  smtp_port: number;

  @Column({ type: 'varchar', default: 'apikey' })
  smtp_user: string;

  @Column({ type: 'varchar', nullable: true })
  smtp_password: string | null;

  @Column({ type: 'varchar', default: 'noreply@medsocio.com' })
  smtp_from: string;

  @Column({ type: 'boolean', default: true })
  smtp_tls: boolean;

  // Regional
  @Column({ type: 'varchar', default: 'Asia/Kolkata' })
  default_timezone: string;

  @Column({ type: 'varchar', default: 'INR' })
  default_currency: string;

  @Column({ type: 'varchar', default: 'DD/MM/YYYY' })
  date_format: string;

  // Maintenance
  @Column({ type: 'boolean', default: false })
  maintenance_mode: boolean;

  @Column({ type: 'int', default: 300 })
  api_rate_limit: number;

  @Column({ type: 'int', default: 90 })
  audit_log_retention_days: number;

  @Column({ type: 'boolean', default: true })
  auto_suspend_on_expiry: boolean;

  @UpdateDateColumn()
  updated_at: Date;
}