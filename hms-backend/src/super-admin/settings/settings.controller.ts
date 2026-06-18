import { Controller, Get, Patch, Post, Body, HttpCode } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @HttpCode(200)
  updateSettings(@Body() body: any) {
    return this.settingsService.updateSettings(body);
  }

  @Post('test-email')
  @HttpCode(200)
  sendTestEmail(@Body() body: { to: string }) {
    return this.settingsService.sendTestEmail(body.to || 'admin@medsocio.com');
  }
}