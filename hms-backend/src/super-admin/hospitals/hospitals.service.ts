import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Hospital } from './hospital.entity';
import { AuditLog } from '../audit/audit.entity';
import { User } from '../../users/user.entity';
import { CreateHospitalDto } from '../../auth/dto/createhospital.dto';

@Injectable()
export class HospitalsService {
  private readonly logger = new Logger(HospitalsService.name);

  constructor(
    @InjectRepository(Hospital)
    private hospitalsRepo: Repository<Hospital>,

    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  // ── LIST ───────────────────────────────────────────────────────────────────

  async findAll(params: {
    search?: string;
    status?: string;
    plan?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, status, plan, page = 1, limit = 20 } = params;

    const qb = this.hospitalsRepo.createQueryBuilder('h');

    if (search) {
      qb.where(
        'h.hospital_name ILIKE :s OR h.hospital_code ILIKE :s OR h.city ILIKE :s',
        { s: `%${search}%` },
      );
    }
    if (status) qb.andWhere('h.status = :status', { status });
    if (plan)   qb.andWhere('h.subscription_plan = :plan', { plan });

    qb.skip((page - 1) * limit)
      .take(limit)
      .orderBy('h.created_at', 'DESC');

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  // ── STATS ──────────────────────────────────────────────────────────────────

  async getStats() {
    const all = await this.hospitalsRepo.find();
    const total     = all.length;
    const active    = all.filter(h => h.status === 'ACTIVE').length;
    const trial     = all.filter(h => h.status === 'TRIAL').length;
    const suspended = all.filter(h => h.status === 'SUSPENDED').length;

    return {
      total_hospitals:     total,
      active_hospitals:    active,
      trial_hospitals:     trial,
      suspended_hospitals: suspended,
      total_users:         0,
      total_patients:      0,
      revenue_this_month:  0,
      revenue_total:       0,
      hospitals_by_plan: {
        ENTERPRISE: all.filter(h => h.subscription_plan === 'ENTERPRISE').length,
        STANDARD:   all.filter(h => h.subscription_plan === 'STANDARD').length,
        BASIC:      all.filter(h => h.subscription_plan === 'BASIC').length,
      },
      growth: { hospitals: 0, users: 0, patients: 0, revenue: 0 },
    };
  }

  // ── CREATE ─────────────────────────────────────────────────────────────────

  async createWithAdmin(
    dto: CreateHospitalDto,
    actorId: string,
    actorName: string,
  ): Promise<{
    hospital: Hospital;
    admin_email: string;
    temp_password: string;
    login_redirect: string;
  }> {
    const primaryEmail = this.normalizeEmail(dto.primary_email);
    const adminEmail = this.normalizeEmail(dto.admin_email);

    // ── Pre-flight uniqueness checks ───────────────────────────────────────
    const existingHospital = await this.hospitalsRepo.findOne({
      where: [
        { hospital_code:  dto.hospital_code },
        { primary_email:  primaryEmail },
      ],
    });
    if (existingHospital) {
      throw new ConflictException(
        'A hospital with this code or email already exists.',
      );
    }

    const existingUser = await this.usersRepo
      .createQueryBuilder('user')
      .where('LOWER(TRIM(user.email)) = :email', { email: adminEmail })
      .getOne();
    if (existingUser) {
      throw new ConflictException(
        'An account with this admin email already exists.',
      );
    }

    // ── Hash password before transaction (bcrypt is slow — do it outside) ──
    const password_hash = await bcrypt.hash(dto.admin_password, 10);

    // ── Single transaction ─────────────────────────────────────────────────
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedHospital: Hospital;

    try {
      // 1. Insert hospital row
      const hospitalResult = await queryRunner.query(
        `INSERT INTO hospitals (
           hospital_name, hospital_code, mrn_prefix,
           primary_email, primary_phone,
           address, city, state, pincode,
           gstin, logo_url, subdomain,
           subscription_plan, primary_color, secondary_color,
           total_beds, status, is_active,
           created_at, updated_at
         ) VALUES (
           $1,  $2,  $3,
           $4,  $5,
           $6,  $7,  $8,  $9,
           $10, $11, $12,
           $13, $14, $15,
           $16, 'TRIAL', true,
           NOW(), NOW()
         ) RETURNING *`,
        [
          dto.hospital_name,
          dto.hospital_code,
          dto.mrn_prefix ?? dto.hospital_code.replace(/[^A-Z]/g, '').slice(0, 3),
          primaryEmail,
          dto.primary_phone,
          dto.address,
          dto.city,
          dto.state,
          dto.pincode,
          dto.gstin         ?? null,
          dto.logo_url      ?? null,
          dto.subdomain     ?? dto.hospital_code.toLowerCase(),
          dto.subscription_plan ?? 'BASIC',
          dto.primary_color    ?? '#33ABC3',
          dto.secondary_color  ?? '#1B3A5C',
          dto.total_beds       ?? 0,
        ],
      );

      savedHospital = hospitalResult[0] as Hospital;
      const hospital_id = savedHospital.hospital_id;

      // 2. Insert admin user — raw query guarantees hospitalId is written
      //    in the same transaction with no ORM context confusion
      await queryRunner.query(
        `INSERT INTO users (
           email, password, name, role,
           "hospitalId",
           "isActive",
           "refreshToken",
           "passwordResetToken", "passwordResetExpiry",
           "createdAt", "updatedAt"
         ) VALUES (
           $1, $2, $3, 'HOSPITAL_ADMIN',
           $4,
           true,
           NULL, NULL, NULL,
           NOW(), NOW()
         )`,
        [
          adminEmail,
          password_hash,
          dto.admin_name,
          hospital_id,     // ← always written, never null
        ],
      );

      // 3. Audit log
      await queryRunner.query(
        `INSERT INTO audit_logs (
           action, resource, resource_id,
           hospital_id, hospital_name,
           user_id, user_name,
           created_at
         ) VALUES (
           'CREATE', 'Hospital', $1,
           $1, $2,
           $3, $4,
           NOW()
         )`,
        [hospital_id, savedHospital.hospital_name, actorId, actorName],
      );

      await queryRunner.commitTransaction();

      this.logger.log(
        `Hospital created: ${hospital_id} | Admin: ${adminEmail}`,
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof ConflictException) throw err;
      this.logger.error('createWithAdmin failed', err);
      throw new InternalServerErrorException(
        'Hospital creation failed. Please try again.',
      );
    } finally {
      await queryRunner.release();
    }

    return {
      hospital:       savedHospital!,
      admin_email:    adminEmail,
      temp_password:  dto.admin_password,
      login_redirect: `/hospital/${savedHospital!.hospital_id}/dashboard`,
    };
  }

  // ── SUSPEND ────────────────────────────────────────────────────────────────

  async suspend(
    id: string,
    reason: string,
    actorId: string,
    actorName: string,
  ) {
    const hospital = await this.hospitalsRepo.findOne({
      where: { hospital_id: id },
    });
    if (!hospital) throw new NotFoundException('Hospital not found');

    await this.hospitalsRepo.update(id, { status: 'SUSPENDED' });

    await this.auditRepo.save({
      action:        'SUSPEND',
      resource:      'Hospital',
      resource_id:   id,
      hospital_id:   id,
      hospital_name: hospital.hospital_name,
      user_id:       actorId,
      user_name:     actorName,
      metadata:      { reason },
    });

    return { message: 'Hospital suspended' };
  }

  // ── ACTIVATE ───────────────────────────────────────────────────────────────

  async activate(id: string, actorId: string, actorName: string) {
    const hospital = await this.hospitalsRepo.findOne({
      where: { hospital_id: id },
    });
    if (!hospital) throw new NotFoundException('Hospital not found');

    await this.hospitalsRepo.update(id, { status: 'ACTIVE' });

    await this.auditRepo.save({
      action:        'ACTIVATE',
      resource:      'Hospital',
      resource_id:   id,
      hospital_id:   id,
      hospital_name: hospital.hospital_name,
      user_id:       actorId,
      user_name:     actorName,
    });

    return { message: 'Hospital activated' };
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────

  private generateTempPassword(): string {
    const upper    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower    = 'abcdefghijklmnopqrstuvwxyz';
    const digits   = '0123456789';
    const specials = '@#$!';
    const all      = upper + lower + digits + specials;

    const pick = (charset: string, n: number) =>
      Array.from({ length: n }, () =>
        charset[Math.floor(Math.random() * charset.length)],
      ).join('');

    const base =
      pick(upper, 2) + pick(lower, 2) + pick(digits, 2) +
      pick(specials, 2) + pick(all, 4);

    return base.split('').sort(() => Math.random() - 0.5).join('');
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
