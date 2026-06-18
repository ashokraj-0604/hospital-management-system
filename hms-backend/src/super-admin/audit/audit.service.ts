import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async findAll(params: {
    search?: string;
    action?: string;
    hospital_id?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, action, hospital_id, page = 1, limit = 20 } = params;

    const qb = this.auditRepo.createQueryBuilder('log')
      .orderBy('log.created_at', 'DESC');

    if (search) {
      qb.where(
        'log.action ILIKE :s OR log.resource ILIKE :s OR log.hospital_name ILIKE :s OR log.user_name ILIKE :s',
        { s: `%${search}%` }
      );
    }
    if (action) qb.andWhere('log.action = :action', { action });
    if (hospital_id) qb.andWhere('log.hospital_id = :hospital_id', { hospital_id });

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }
}