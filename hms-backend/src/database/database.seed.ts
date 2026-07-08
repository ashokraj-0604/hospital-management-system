import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const existing = await this.usersRepo.findOne({
      where: { role: 'SUPER_ADMIN' },
    });

    if (existing) {
      console.log('✅ Super Admin already exists');
      return;
    }

    const password = await bcrypt.hash('Admin@123', 10);

    await this.usersRepo.save({
      name: 'Super Admin',
      email: 'admin@medsocio.com',
      password,
      role: 'SUPER_ADMIN',
      isActive: true,
    });

    console.log('===================================');
    console.log('SUPER ADMIN CREATED');
    console.log('Email: admin@medsocio.com');
    console.log('Password: Admin@123');
    console.log('===================================');
  }
}