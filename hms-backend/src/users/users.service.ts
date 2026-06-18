import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(query: { search?: string; role?: string; status?: string }) {
    const qb = this.userRepository.createQueryBuilder('user');

    if (query.search) {
      qb.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }
    if (query.role) {
      qb.andWhere('user.role = :role', { role: query.role });
    }
    if (query.status === 'active') {
      qb.andWhere('user.isActive = true');
    } else if (query.status === 'inactive') {
      qb.andWhere('user.isActive = false');
    }

    qb.orderBy('user.createdAt', 'DESC');
    qb.select([
      'user.id',
      'user.name',
      'user.email',
      'user.role',
      'user.isActive',
      'user.hospitalId',
      'user.createdAt',
    ]);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}