import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformSettings } from './settings.entity';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformSettings])],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}