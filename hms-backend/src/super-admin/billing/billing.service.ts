import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
  ) {}

  async findAll(params: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, status, page = 1, limit = 20 } = params;

    const qb = this.invoiceRepo.createQueryBuilder('inv')
      .orderBy('inv.created_at', 'DESC');

    if (search) {
      qb.where(
        'inv.hospital_name ILIKE :s OR inv.invoice_no ILIKE :s',
        { s: `%${search}%` }
      );
    }
    if (status) qb.andWhere('inv.status = :status', { status });

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
}