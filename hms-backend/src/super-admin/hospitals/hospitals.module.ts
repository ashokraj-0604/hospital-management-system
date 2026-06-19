import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';
import { AuditLog } from '../audit/audit.entity';
import { User } from '../../users/user.entity';          // ← added
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, AuditLog, User])],  // ← User added
  providers: [HospitalsService],
  controllers: [HospitalsController],
  exports: [HospitalsService],
})
export class HospitalsModule {}