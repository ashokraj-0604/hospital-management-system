import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  log_id: string;

  @Column({ type: 'varchar' })
  action: string; // CREATE, UPDATE, DELETE, SUSPEND, ACTIVATE

  @Column({ type: 'varchar' })
  resource: string; // Hospital, User, Invoice

  @Column({ type: 'varchar', nullable: true })
  resource_id: string | null;

  @Column({ type: 'varchar' })
  hospital_id: string;

  @Column({ type: 'varchar' })
  hospital_name: string;

  @Column({ type: 'varchar' })
  user_id: string;

  @Column({ type: 'varchar' })
  user_name: string;

  @Column({ type: 'varchar', nullable: true })
  ip_address: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn()
  created_at: Date;
}