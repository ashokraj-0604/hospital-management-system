import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HospitalsModule } from './super-admin/hospitals/hospitals.module';
import { AuditModule } from './super-admin/audit/audit.module';
import { DatabaseModule } from './database/database.module';
import { BillingModule } from './super-admin/billing/billing.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './super-admin/settings/settings.module';
import { TenantsModule } from './tenants/tenants.module';
import { PatientsModule } from './patients/patient.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    HospitalsModule,
    AuditModule,
    BillingModule,
    UsersModule,
    SettingsModule,
    TenantsModule,
    PatientsModule,
    DatabaseModule,
  ],
})
export class AppModule {}