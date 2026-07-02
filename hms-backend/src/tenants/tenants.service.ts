import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from '../super-admin/hospitals/hospital.entity';
import { PlatformSettings } from '../super-admin/settings/settings.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalsRepo: Repository<Hospital>,
    @InjectRepository(PlatformSettings)
    private settingsRepo: Repository<PlatformSettings>,
  ) {}

  async getBranding(subdomain?: string) {
    const platform = await this.getOrCreatePlatformSettings();

    const normalized = this.normalizeSubdomain(subdomain);

    if (!normalized || normalized === 'default') {
      return this.toPlatformBranding(platform);
    }

    const hospital = await this.hospitalsRepo.findOne({
      where: { subdomain: normalized },
    });

    if (!hospital) {
      return this.toPlatformBranding(platform);
    }

    return {
      tenant_type: 'HOSPITAL',
      subdomain: hospital.subdomain,
      platform_name: hospital.hospital_name,
      logo_url: hospital.logo_url,
      primary_color: hospital.primary_color,
      secondary_color: hospital.secondary_color,
      support_email: hospital.primary_email,
      support_phone: hospital.primary_phone,
    };
  }

  private normalizeSubdomain(value?: string) {
    if (!value) return '';
    return value.trim().toLowerCase();
  }

  private async getOrCreatePlatformSettings() {
    const existing = await this.settingsRepo.findOne({ where: {} });
    if (existing) return existing;

    const defaults = this.settingsRepo.create({});
    return this.settingsRepo.save(defaults);
  }

  private toPlatformBranding(platform: PlatformSettings) {
    return {
      tenant_type: 'PLATFORM',
      subdomain: 'default',
      platform_name: platform.platform_name,
      logo_url: null,
      primary_color: platform.primary_color,
      secondary_color: '#1B3A5C',
      support_email: platform.support_email,
      support_phone: platform.support_phone,
    };
  }
}
