import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  // MRN format: MRN-<hospitalCode(4)>-<year>-<sequence>
  private async generateMrn(hospitalId: string): Promise<string> {
    const year = new Date().getFullYear();
    const hospitalPrefix = hospitalId.replace(/-/g, '').slice(0, 4).toUpperCase();
    const count = await this.patientRepo.count({ where: { hospital_id: hospitalId } });
    const sequence = String(count + 1).padStart(5, '0');
    return `MRN-${hospitalPrefix}-${year}-${sequence}`;
  }

  // 4.1.1 — flag duplicate patients based on name, DOB, and phone match
  async findDuplicates(
    hospitalId: string,
    full_name: string,
    date_of_birth: string,
    phone: string,
  ): Promise<Patient[]> {
    return this.patientRepo.find({
      where: [
        { hospital_id: hospitalId, full_name: ILike(full_name), date_of_birth },
        { hospital_id: hospitalId, phone },
      ],
      take: 5,
    });
  }

  async findAll(hospitalId: string, query: QueryPatientDto) {
    const page = Math.max(parseInt(query.page ?? '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(query.limit ?? '20', 10), 1), 100);

    const qb = this.patientRepo
      .createQueryBuilder('patient')
      .where('patient.hospital_id = :hospitalId', { hospitalId });

    if (query.search) {
      qb.andWhere(
        '(patient.full_name ILIKE :search OR patient.mrn ILIKE :search OR patient.phone ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }
    if (query.status) {
      qb.andWhere('patient.status = :status', { status: query.status });
    }
    if (query.gender) {
      qb.andWhere('patient.gender = :gender', { gender: query.gender });
    }

    qb.orderBy('patient.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(hospitalId: string, patientId: string): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { patient_id: patientId, hospital_id: hospitalId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient ${patientId} not found`);
    }
    return patient;
  }

  async create(hospitalId: string, dto: CreatePatientDto): Promise<Patient> {
    if (!dto.duplicate_override) {
      const duplicates = await this.findDuplicates(
        hospitalId,
        dto.full_name,
        dto.date_of_birth,
        dto.phone,
      );
      if (duplicates.length > 0) {
        throw new ConflictException({
          message: 'Possible duplicate patient found',
          code: 'DUPLICATE_PATIENT',
          duplicates: duplicates.map((d) => ({
            patient_id: d.patient_id,
            mrn: d.mrn,
            full_name: d.full_name,
            phone: d.phone,
            date_of_birth: d.date_of_birth,
          })),
        });
      }
    }

    const mrn = await this.generateMrn(hospitalId);
    const patient = this.patientRepo.create({
      ...dto,
      hospital_id: hospitalId,
      mrn,
      blood_group: (dto.blood_group as any) ?? 'UNKNOWN',
      registration_type: (dto.registration_type as any) ?? 'WALK_IN',
    });

    return this.patientRepo.save(patient);
  }

  async update(
    hospitalId: string,
    patientId: string,
    dto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findOne(hospitalId, patientId);
    Object.assign(patient, dto);
    return this.patientRepo.save(patient);
  }

  // Soft-delete: patients are never hard-deleted (7-year retention requirement)
  async deactivate(hospitalId: string, patientId: string): Promise<Patient> {
    const patient = await this.findOne(hospitalId, patientId);
    patient.status = 'INACTIVE';
    return this.patientRepo.save(patient);
  }
}
