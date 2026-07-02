import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from '../super-admin/hospitals/hospital.entity';
import { PlatformSettings } from '../super-admin/settings/settings.entity';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, PlatformSettings])],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
