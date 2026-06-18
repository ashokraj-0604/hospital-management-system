import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  invoice_id: string;

  @Column({ type: 'varchar', unique: true })
  invoice_no: string;

  @Column({ type: 'varchar' })
  hospital_id: string;

  @Column({ type: 'varchar' })
  hospital_name: string;

  @Column({ type: 'varchar' })
  subscription_plan: string;

  @Column({ type: 'date' })
  period_from: Date;

  @Column({ type: 'date' })
  period_to: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: InvoiceStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}