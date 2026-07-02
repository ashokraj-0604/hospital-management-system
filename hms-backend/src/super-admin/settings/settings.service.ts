import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformSettings } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(PlatformSettings)
    private settingsRepo: Repository<PlatformSettings>,
  ) {}

  // Always one row — get or create
  async getSettings(): Promise<PlatformSettings> {
    const existing = await this.settingsRepo.findOne({ where: {} });
    if (existing) return existing;

    // First boot — create defaults
    const defaults = this.settingsRepo.create({});
    return this.settingsRepo.save(defaults);
  }

  async updateSettings(dto: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const settings = await this.getSettings();
    // Never overwrite id or updated_at from request
    const { id, updated_at, ...safe } = dto as any;
    Object.assign(settings, safe);
    return this.settingsRepo.save(settings);
  }

  async sendTestEmail(to: string): Promise<{ message: string }> {
    // TODO: wire real nodemailer/sendgrid here
    console.log(`[DEV] Test email would be sent to: ${to}`);
    return { message: `Test email sent to ${to}` };
  }
}