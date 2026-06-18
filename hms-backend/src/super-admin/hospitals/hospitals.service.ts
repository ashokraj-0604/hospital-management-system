import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Hospital } from './hospital.entity';
import { AuditLog } from '../audit/audit.entity';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalsRepo: Repository<Hospital>,
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async findAll(params: {
    search?: string;
    status?: string;
    plan?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, status, plan, page = 1, limit = 20 } = params;

    const where: FindOptionsWhere<Hospital> = {};
    if (status) where.status = status as any;
    if (plan) where.subscription_plan = plan as any;

    const qb = this.hospitalsRepo.createQueryBuilder('h');
    if (search) {
      qb.where(
        'h.hospital_name ILIKE :s OR h.hospital_code ILIKE :s OR h.city ILIKE :s',
        { s: `%${search}%` }
      );
    }
    if (status) qb.andWhere('h.status = :status', { status });
    if (plan) qb.andWhere('h.subscription_plan = :plan', { plan });

    qb.skip((page - 1) * limit).take(limit).orderBy('h.created_at', 'DESC');

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async getStats() {
    const all = await this.hospitalsRepo.find();
    const total = all.length;
    const active = all.filter(h => h.status === 'ACTIVE').length;
    const trial = all.filter(h => h.status === 'TRIAL').length;
    const suspended = all.filter(h => h.status === 'SUSPENDED').length;

    return {
      total_hospitals: total,
      active_hospitals: active,
      trial_hospitals: trial,
      suspended_hospitals: suspended,
      total_users: 0, // join with users table later
      total_patients: 0,
      revenue_this_month: 0,
      revenue_total: 0,
      hospitals_by_plan: {
        ENTERPRISE: all.filter(h => h.subscription_plan === 'ENTERPRISE').length,
        STANDARD: all.filter(h => h.subscription_plan === 'STANDARD').length,
        BASIC: all.filter(h => h.subscription_plan === 'BASIC').length,
      },
      growth: {
        hospitals: 0,
        users: 0,
        patients: 0,
        revenue: 0,
      },
    };
  }

  async create(dto: Partial<Hospital>, actorId: string, actorName: string) {
    const hospital = this.hospitalsRepo.create(dto);
    const saved = await this.hospitalsRepo.save(hospital);

    await this.auditRepo.save({
      action: 'CREATE',
      resource: 'Hospital',
      resource_id: saved.hospital_id,
      hospital_id: saved.hospital_id,
      hospital_name: saved.hospital_name,
      user_id: actorId,
      user_name: actorName,
    });

    return saved;
  }

  async suspend(id: string, reason: string, actorId: string, actorName: string) {
    const hospital = await this.hospitalsRepo.findOne({ where: { hospital_id: id } });
    if (!hospital) throw new NotFoundException('Hospital not found');

    await this.hospitalsRepo.update(id, { status: 'SUSPENDED' });

    await this.auditRepo.save({
      action: 'SUSPEND',
      resource: 'Hospital',
      resource_id: id,
      hospital_id: id,
      hospital_name: hospital.hospital_name,
      user_id: actorId,
      user_name: actorName,
      metadata: { reason },
    });

    return { message: 'Hospital suspended' };
  }

  async activate(id: string, actorId: string, actorName: string) {
    const hospital = await this.hospitalsRepo.findOne({ where: { hospital_id: id } });
    if (!hospital) throw new NotFoundException('Hospital not found');

    await this.hospitalsRepo.update(id, { status: 'ACTIVE' });

    await this.auditRepo.save({
      action: 'ACTIVATE',
      resource: 'Hospital',
      resource_id: id,
      hospital_id: id,
      hospital_name: hospital.hospital_name,
      user_id: actorId,
      user_name: actorName,
    });

    return { message: 'Hospital activated' };
  }
}